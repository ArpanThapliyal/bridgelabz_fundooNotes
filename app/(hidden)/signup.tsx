import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSignup = () => {
    setErrorMessage(null);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(user)
          .then(() => {
            Alert.alert('Verification email sent! Please check your inbox.');
            setEmailSent(true);
          })
          .catch(() => {
            setErrorMessage('Error sending verification email.');
          });
        setEmail('');
        setPassword('');
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign up</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      { !emailSent ? (
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.info}>
          A verification email has been sent to your email address. Please verify your email before login!
        </Text>
      )}
      <TouchableOpacity onPress={() => router.push('/(hidden)/login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: '#121212' 
  },
  title: { 
    fontSize: 28, 
    color: '#ffffff', 
    marginBottom: 20 
  },
  input: {
    width: '100%',
    backgroundColor: '#1e1e1e', 
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
    color: '#ffffff'
  },
  button: {
    backgroundColor: '#bb86fc', 
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: { 
    color: '#121212', 
    fontWeight: 'bold'
  },
  error: { 
    color: '#cf6679', 
    marginBottom: 10 
  },
  info: { 
    color: '#03dac6', 
    marginBottom: 10, 
    textAlign: 'center'
  },
  link: { 
    color: '#03dac6', 
    marginTop: 10 
  }
});
