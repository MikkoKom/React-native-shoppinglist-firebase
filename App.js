import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity } from 'react-native';
import { firestore } from './firebase/Config';
import { collection, addDoc, onSnapshot, deleteDoc, doc } from "firebase/firestore";

export default function App() {
  const [itemName, setItemName] = useState('');
  const [items, setItems] = useState([]);


  const addItem = async () => {
    if (itemName.trim()) {
      try {
        await addDoc(collection(firestore, 'shoppinglist'), { name: itemName });
        setItemName('');
      } catch (error) {
        console.error("Error adding item: ", error);
      }
    }
  };


  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'shoppinglist', id));
    } catch (error) {
      console.error("Error deleting item: ", error);
    }
  };


  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'shoppinglist'), (snapshot) => {
      const itemList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemList);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>

      <TextInput
        style={styles.input}
        placeholder="Add new item..."
        value={itemName}
        onChangeText={setItemName}
      />

      <Button title="Add Item" onPress={addItem} />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.itemText}>{item.name}</Text>
            <TouchableOpacity onPress={() => deleteItem(item.id)}>
              <Text style={styles.deleteButton}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: '100%',
  },
  itemText: {
    fontSize: 18,
  },
  deleteButton: {
    fontSize: 20,
    color: 'red',
  },
});
