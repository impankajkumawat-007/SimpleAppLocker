import React from 'react';
import {View, TextInput, TouchableOpacity, Text, StyleSheet} from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({value, onChangeText, placeholder = 'Search apps...'}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999999"
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {value.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChangeText('')}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    height: 44,
  },
  input: {
    flex: 1,
    height: 44,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  clearButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  clearText: {
    fontSize: 16,
    color: '#888888',
    fontWeight: '600',
  },
});
