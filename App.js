import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Pressable,
  Alert
} from "react-native";

export default function App() {

  const [enteredNoteText, setEnteredNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  function noteInputHandler(text) {
    setEnteredNoteText(text);
  }

  function addNoteHandler() {
    if (!enteredNoteText.trim()) return;

    setNotes((currentNotes) => [
      ...currentNotes,
      { id: Math.random().toString(), text: enteredNoteText }
    ]);

    setEnteredNoteText("");
  }

  function openNoteHandler(id) {
    const noteToEdit = notes.find((note) => note.id === id);

    if (!noteToEdit) return;

    setSelectedNoteId(id);
    setEnteredNoteText(noteToEdit.text);
  }

  function updateNoteHandler() {
    if (!enteredNoteText.trim()) return;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNoteId
          ? { ...note, text: enteredNoteText }
          : note
      )
    );

    setSelectedNoteId(null);
    setEnteredNoteText("");
  }

  function cancelEditHandler() {
    setSelectedNoteId(null);
    setEnteredNoteText("");
  }

  function confirmDeleteHandler(id) {
    Alert.alert(
      "Delete this note?",
      "Are you sure you want to delete it?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => deleteNoteHandler(id)
        }
      ]
    );
  }

  function deleteNoteHandler(id) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id)
    );

    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setEnteredNoteText("");
    }
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>My Notes</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a note..."
        onChangeText={noteInputHandler}
        value={enteredNoteText}
      />

      {selectedNoteId ? (
        <View style={styles.buttonRow}>
          <Button title="Update" onPress={updateNoteHandler} />
          <Button title="Cancel" onPress={cancelEditHandler} />
        </View>
      ) : (
        <Button title="Add Note" onPress={addNoteHandler} />
      )}

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openNoteHandler(item.id)}
            onLongPress={() => confirmDeleteHandler(item.id)}
            delayLongPress={300}
            style={({ pressed }) => [
              styles.noteItem,
              selectedNoteId === item.id && styles.selectedItem,
              pressed && styles.pressedItem
            ]}
          >
            <Text style={styles.noteText}>{item.text}</Text>
          </Pressable>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingTop: 60,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  noteItem: {
    backgroundColor: "#f1f1f1",
    padding: 15,
    marginVertical: 6,
    borderRadius: 6,
  },

  noteText: {
    fontSize: 16,
  },

  selectedItem: {
    backgroundColor: "#cde7ff",
  },

  pressedItem: {
    opacity: 0.6,
  },
});
