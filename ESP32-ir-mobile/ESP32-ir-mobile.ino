#include <WiFi.h>
#include <WiFiClient.h>
#include <ESP32WebServer.h>
#include <ESPmDNS.h>
#include <IRremote.h>

// Web server object. Will be listening in port 80 (default for HTTP)
ESP32WebServer server(80);

//IR init
int RED_PIN = 5;
int GREEN_PIN = 6;
int BLUE_PIN = 10;

int RECV_PIN = 11;
int SEND_PIN = 4;

String lastIRCodeReceived = "";

boolean recording = false;
boolean redBlinkState = HIGH;
int redBlinkRate = 750;
unsigned long milliCounter = 0;

IRrecv irrecv(RECV_PIN);
IRsend irsend;
decode_results results;

void setup() {
  Serial.begin(115200);
  WiFi.begin("2MuchFun", "burgerbelly"); //Connect to the WiFi network

  while (WiFi.status() != WL_CONNECTED) { //Wait for connection
    delay(500);
    Serial.println("Waiting to connect…");
  }

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/rec", startRecord);
  server.on("/stop", stopRecord);
  server.on("/check", checkIRCode);
  server.on("/clear", clearState);
  server.on("/send", sendCode);
  server.on("/test", test);


  server.begin();
  Serial.println("Server listening");
  irrecv.enableIRIn(); // Start the receiver
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
  digitalWrite(RED_PIN, HIGH);
  digitalWrite(GREEN_PIN, HIGH);
  digitalWrite(BLUE_PIN, HIGH);
}

void loop() {
  server.handleClient();
  processIR();
  blinkCheck();
}

void startRecord() {
  recording = true;
  server.send(200, "application/json", "{\"message\": \"starting record mode...\"}");
}

void stopRecord() {
  recording = false;
  server.send(200, "application/json", "{\"message\": \"stopping record mode...\"}");
}

void checkIRCode() {
  server.send(200, "application/json", "{" + lastIRCodeReceived + "}");
  lastIRCodeReceived = "";
}

void clearState() {
  lastIRCodeReceived = "";
  server.send(200, "application/json", "{\"message\": \"state cleared.\"}");
}

// esxpects query string of `?type=PEM&value=1234ABC&length=32`
void sendCode() {
  String message = "";
  for (int i = 0; i < server.args(); i++) {
    message += server.argName(i) + ":" + server.arg(i) + ",";
  }
  
  String irCodeType = getValueOfQueryParam("type", message);
  String irCodeValStr  = getValueOfQueryParam("value", message);
  String irCodeLengthStr = getValueOfQueryParam("length", message);
  int irCodeLength = irCodeLengthStr.toInt();

  unsigned long irCodeValue = strtoul(irCodeValStr.c_str(), NULL, 16);
  transmitCode(irCodeType, irCodeValue, irCodeLength);
      
  server.send(200, "text/plain", "sending IR code " + message + "...");
}

String getValueOfQueryParam(String key, String s) {
  int beginIndex = s.indexOf(key + ":") + key.length();
  int endIndex = s.indexOf(",", beginIndex);
  return s.substring(beginIndex, endIndex);
 }

void test() {
  String message = "";
  for (int i = 0; i < server.args(); i++) {
    message += server.argName(i) + ":" + server.arg(i) + ",";
  }
  server.send(200, "application/json", "{\"args\":" + message + ", \"ircode\":" + lastIRCodeReceived + "}");
}

