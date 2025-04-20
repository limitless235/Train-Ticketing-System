import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define interfaces for props
interface Passenger {
  name: string;
  age: string;
  aadhar: string;
}

interface Train {
  train_name: string;
  train_number: string;
  class: string;
  price: number;
}

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, marginBottom: 10 },
  text: { fontSize: 12 }
});

export default function BookingPDF({ passenger, train }: { passenger: Passenger, train: Train }) {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.header}>E-Ticket</Text>
          <Text style={styles.header}>Indian Railways</Text>
          
          <Text style={styles.text}>Passenger Name: {passenger.name}</Text>
          <Text style={styles.text}>Age: {passenger.age}</Text>
          <Text style={styles.text}>Aadhar: {passenger.aadhar}</Text>
          
          <Text style={[styles.header, { marginTop: 20 }]}>Journey Details</Text>
          <Text style={styles.text}>Train: {train.train_name} ({train.train_number})</Text>
          <Text style={styles.text}>Class: {train.class}</Text>
          <Text style={styles.text}>Price: ₹{train.price}</Text>
        </View>
      </Page>
    </Document>
  );
}
