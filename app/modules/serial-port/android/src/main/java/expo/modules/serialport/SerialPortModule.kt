package expo.modules.serialport

import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.hardware.usb.UsbManager
import androidx.core.os.bundleOf
import com.hoho.android.usbserial.driver.UsbSerialDriver
import com.hoho.android.usbserial.driver.UsbSerialPort
import com.hoho.android.usbserial.driver.UsbSerialProber
import com.hoho.android.usbserial.util.SerialInputOutputManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.concurrent.Executors

class SerialPortModule : Module() {
    private lateinit var usbManager: UsbManager;

    private var driver: UsbSerialDriver? = null
    private var port: UsbSerialPort? = null
    private var ioManager: SerialInputOutputManager? = null

    private val executor = Executors.newSingleThreadExecutor()

    private val ACTION_USB_PERMISSION = "expo.serialport.USB_PERMISSION"

    override fun definition() = ModuleDefinition {
        Name("SerialPortModule")

        OnCreate {
            usbManager = (appContext.reactContext?.applicationContext?.getSystemService(Context.USB_SERVICE)
                ?: throw Exception("Cannot get usb service")) as UsbManager;
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
                throw Exception("Cannot get drivers");
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
                return@AsyncFunction null;
            }

            port = driver!!.ports.get(0);
            port!!.open(connection);
            port!!.setParameters(9600, 8, UsbSerialPort.STOPBITS_1, UsbSerialPort.PARITY_NONE);

            ioManager = SerialInputOutputManager(port, object : SerialInputOutputManager.Listener {

                private val buffer = StringBuilder()

                override fun onNewData(data: ByteArray) {
                    val chunk = String(data, Charsets.UTF_8)
                    buffer.append(chunk)

                    var newlineIndex: Int

                    // Process all complete lines
                    while (true) {
                        newlineIndex = buffer.indexOf("\n")
                        if (newlineIndex == -1) break

                        val line = buffer.substring(0, newlineIndex).trim()
                        buffer.delete(0, newlineIndex + 1)

                        if (line.isNotEmpty()) {
                            this@SerialPortModule.sendEvent(
                                "onData",
                                bundleOf("data" to line)
                            );
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
            ioManager?.stop()
            port?.close()
            ioManager = null
            port = null
        }

        Events("onData", "onError")
    }
}
