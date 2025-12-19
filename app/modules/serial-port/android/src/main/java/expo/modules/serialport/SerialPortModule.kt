package expo.modules.serialport

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.hardware.usb.UsbManager
import androidx.core.content.ContextCompat
import androidx.core.os.bundleOf
import com.hoho.android.usbserial.driver.UsbSerialDriver
import com.hoho.android.usbserial.driver.UsbSerialPort
import com.hoho.android.usbserial.driver.UsbSerialProber
import com.hoho.android.usbserial.util.SerialInputOutputManager
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.json.JSONObject
import java.util.concurrent.Executors

enum class ERRORS {
    CANNOT_GET_USB_SERVICE,
    CANNOT_GET_DRIVERS,
    PERMISSION_REQUIRED,
    USB_NOT_CONNECTED,
    WRITE_FAILED
}

class SerialPortModule : Module() {
    private lateinit var usbManager: UsbManager;
    private var driver: UsbSerialDriver? = null
    private var port: UsbSerialPort? = null
    private var ioManager: SerialInputOutputManager? = null
    private val executor = Executors.newSingleThreadExecutor()
    private val ACTION_USB_PERMISSION = "expo.serialport.USB_PERMISSION"

    private val usbReceiver = object : android.content.BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            when (intent?.action) {
                UsbManager.ACTION_USB_DEVICE_DETACHED -> {
                    val device =
                        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
                            intent.getParcelableExtra(
                                UsbManager.EXTRA_DEVICE,
                                android.hardware.usb.UsbDevice::class.java
                            )
                        } else {
                            @Suppress("DEPRECATION")
                            intent.getParcelableExtra(UsbManager.EXTRA_DEVICE)
                        }


                    if (driver?.device == device) {
                        disconnect()
                        sendEvent("onError", bundleOf("code" to "USB_DISCONNECTED"))
                    }
                }
            }
        }
    }

    private fun disconnect() {
        ioManager?.stop()
        port?.close()
        ioManager = null
        port = null
    }

    override fun definition() = ModuleDefinition {
        Name("SerialPortModule")

        OnCreate {
            usbManager = (appContext.reactContext?.applicationContext?.getSystemService(Context.USB_SERVICE)
                ?: throw CodedException(ERRORS.CANNOT_GET_USB_SERVICE.name, "Cannot get usb service", Exception())) as UsbManager
            val filter = android.content.IntentFilter().apply {
                addAction(UsbManager.ACTION_USB_DEVICE_DETACHED)
            }

            ContextCompat.registerReceiver(
                appContext.reactContext!!,
                usbReceiver,
                filter,
                ContextCompat.RECEIVER_NOT_EXPORTED
            )
        }

        Function("listDevices") {
            val drivers = UsbSerialProber.getDefaultProber().findAllDrivers(usbManager)
            return@Function drivers.mapIndexed { index, d ->
                mapOf(
                    "id" to index,
                    "vendorId" to d.device.vendorId,
                    "productId" to d.device.productId,
                    "deviceName" to d.device.deviceName
                )
            }
        }

        AsyncFunction("connect") {
            val availableDrivers = UsbSerialProber.getDefaultProber().findAllDrivers(usbManager);
            if (availableDrivers.isEmpty()) {
                throw CodedException(ERRORS.CANNOT_GET_DRIVERS.name, "Cannot get drivers", Exception())
            }
            driver = availableDrivers.get(0);
            var connection = usbManager.openDevice(driver!!.getDevice());
            if (connection == null) {
                val intent = PendingIntent.getBroadcast(
                    appContext.reactContext,
                    0,
                    Intent(ACTION_USB_PERMISSION),
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
                )
                usbManager.requestPermission(driver!!.device, intent)
                throw CodedException(ERRORS.PERMISSION_REQUIRED.name, "Cannot get drivers", Exception())
            }

            port = driver!!.ports.get(0);
            port!!.open(connection);
            port!!.setParameters(9600, 8, UsbSerialPort.STOPBITS_1, UsbSerialPort.PARITY_NONE);

            ioManager = SerialInputOutputManager(port, object : SerialInputOutputManager.Listener {

                private val buffer = StringBuilder()

                override fun onNewData(data: ByteArray) {
                    val chunk = String(data, Charsets.UTF_8)
                    buffer.append(chunk)

                    while (true) {
                        val idx = buffer.indexOf("\n")
                        if (idx == -1) break

                        val line = buffer.substring(0, idx).trim()
                        buffer.delete(0, idx + 1)

                        if (line.isNotEmpty()) {
                            try {
                                // Parse JSON string into a map
                                val json = JSONObject(line)
                                val map = mutableMapOf<String, Any>()
                                json.keys().forEach { key ->
                                    map[key] = json.get(key)
                                }

                                this@SerialPortModule.sendEvent(
                                    "onData",
                                    bundleOf("data" to map)
                                )
                            } catch (e: Exception) {
                                // fallback: send raw string
                                this@SerialPortModule.sendEvent(
                                    "onData",
                                    bundleOf("data" to line)
                                )
                            }
                        }
                    }
                }

                override fun onRunError(e: Exception) {
                    this@SerialPortModule.sendEvent(
                        "onData",
                        bundleOf(
                            "data" to (e.message ?: "Unknown error")
                        )
                    );
                }
            })


            executor.execute(ioManager)
        }

        AsyncFunction("disconnect") {
            disconnect()
        }

        AsyncFunction("setQNH") { qnh: Double ->
            if (port == null) {
                CodedException(ERRORS.USB_NOT_CONNECTED.name, "Usb not connected", Exception())
            }


            try {
                // Write to the serial port
                val commandJson =
                    """{"command":"SET_QNH","params":{"qnh":$qnh}}""" + "\n"
                port!!.write(commandJson.toByteArray(Charsets.UTF_8), 1000)
            } catch (e: Exception) {
                throw CodedException(ERRORS.WRITE_FAILED.name, "Write failed", Exception())
            }
        }


        Events("onData", "onError")
    }
}
