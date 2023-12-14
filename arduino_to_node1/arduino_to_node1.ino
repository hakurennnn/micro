int sensorPin = A0;    // Analog pin connected to the MQ-6 sensor
int relayPin = 2;      // Digital pin connected to the relay control
int ledPin = 3;        // Digital pin connected to the LED
int buzzerPin = 4;     // Digital pin connected to the buzzer
int threshold = 500;   // Adjust this threshold value based on your requirements

int value = 0;
int prevValue = 0;

void setup() {
  Serial.begin(9600);
  pinMode(relayPin, OUTPUT);
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
}

void loop() {
  value = round(analogRead(sensorPin));
  
  if (value != prevValue) {
    Serial.println(value);
    prevValue = value;

    // Check if the sensor reading is above the threshold
    if (value > threshold) {
      // If above threshold, turn on relay, LED, and buzzer
      digitalWrite(relayPin, HIGH);
      digitalWrite(ledPin, HIGH);
      digitalWrite(buzzerPin, HIGH);
    } else {
      // If below threshold, turn off relay, LED, and buzzer
      digitalWrite(relayPin, LOW);
      digitalWrite(ledPin, LOW);
      digitalWrite(buzzerPin, LOW);
    }
  }

  delay(100);  // Adjust the delay based on your application's requirements
}
