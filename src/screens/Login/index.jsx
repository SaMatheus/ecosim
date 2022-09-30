import React, { useState } from 'react'
import auth from '@react-native-firebase/auth';
import { StyleSheet, ActivityIndicator } from 'react-native';
import {
  Box,
  Center,
  FormControl,
  Input,
  WarningOutlineIcon,
  Text,
  Icon,
  VStack,
  Button,
  Image,
  Checkbox,
  Modal
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { emailValidation } from '../../utils/validations';


const Login = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createPassword, setCreatePassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loginLoading, setLoginLoadin] = useState(false)


  const fieldsValidation = (callback) => {
    const validationEmail = emailValidation(email);
    if (email === '' || !validationEmail) {
      setLoginLoadin(false)
      return setIsEmailValid(true);
    } else {
      setIsEmailValid(false)
    }

    if (password === '' && !forgotPassword) {
      setLoginLoadin(false)
      return setIsPasswordValid(true);
    }

    if (validationEmail && password !== '') {
      callback
       setLoginLoadin(false)
       setIsPasswordValid(false)
       return setIsEmailValid(false)
    }

  };

  const handleSignIn = () => {
    setLoginLoadin(true)
    const signInFn = auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => console.log('Success', response))
      .catch((error) => console.log('Error', error));

    return fieldsValidation(signInFn)
  };

  const handleSignUp = () => {
    const signUpFn = auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => console.log('Conta criada com sucesso!'))
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        console.error(error);
      });
    
      return fieldsValidation(signUpFn)
  };

  const handleResetPassword = () => {
    const resetFn = auth()
      .sendPasswordResetEmail(email)
      .then((response) => console.log(response))
      .catch((error) => console.log(error))

    fieldsValidation(resetFn)
    return setForgotPassword(false);
  };

  return (
    <Center height='full' bg='#121214'>
      <VStack
        alignSelf='center'
        width='full'
        justifyContent='center'
        p={10}
        space={12}
      >
        <Image style={styles.image} source={require('../../assets/login-icon.png')} alt='logomarca' />
        <VStack h={createPassword ? 220 : 160} space={8}>
          <Box alignItems='flex-start'>
            <FormControl isInvalid={isEmailValid}>
              <Input
                variant='underlined'
                placeholder='E-mail'
                placeholderTextColor='#fff'
                _focus={{ borderColor: '#00875f' }}
                color='#fff'
                value={email}
                onChangeText={setEmail}
                size='xl'
                isRequired
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                <Text>Esse campo está vazio ou não está no formato de um email, ex: email@ex.com</Text>
              </FormControl.ErrorMessage>
            </FormControl>
          </Box>
          <Box alignItems='flex-start'>
            <FormControl isInvalid={isPasswordValid}>
              <Input
                variant='underlined'
                placeholder='Senha'
                type={!showPassword ? 'password' : 'text'}
                placeholderTextColor='#fff'
                _focus={{ borderColor: '#00875f' }}
                color='#fff'
                value={password}
                onChangeText={setPassword}
                size='xl'
                InputRightElement={
                  !createPassword
                  && <Icon
                    as={Ionicons}
                    name={showPassword ? 'md-eye-off-outline' : 'md-eye-outline'}
                    size={5}
                    marginRight={3}
                    color='#fff'
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={password === ''}
                  />
                }
                isRequired
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                <Text>Preencha este campo!</Text>
              </FormControl.ErrorMessage>
            </FormControl>
            {!createPassword
              && <Text color='#fff' mt={2} alignSelf='flex-end' onPress={() => setForgotPassword(true)}>Esqueceu sua senha?</Text>
            }
          </Box>
          {
            createPassword && (
              <Box alignItems='flex-start'>
                <FormControl isInvalid={isPasswordValid}>
                  <Input
                    variant='underlined'
                    placeholder='Confirme a senha'
                    type={!showPassword ? 'password' : 'text'}
                    placeholderTextColor='#fff'
                    _focus={{ borderColor: '#00875f' }}
                    color='#fff'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    size='xl'
                    isRequired
                  />
                  <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                    <Text>Preencha este campo!</Text>
                  </FormControl.ErrorMessage>
                </FormControl>
                <Checkbox
                  value={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                  mt={4}
                  _checked={{ 
                    borderColor: '#00B37E',
                    backgroundColor: '#00B37E'
                  }}
                >
                  <Text color='#fff'>Mostrar senhas</Text>
                </Checkbox>
              </Box>
            )
          }
        </VStack>
        <VStack w='full' space={6}>
          {
            !createPassword &&
            <Button
              onPress={handleSignIn}
              bgColor='#00875f'
              width='full'
              h={50}
              _text={styles.buttonText}
            >
              Entrar
            </Button>
          }
          <Button
            variant={createPassword ? 'solid' : 'unstyled'}
            onPress={() => createPassword ? handleSignUp : setCreatePassword(true)}
            bgColor={createPassword ? '#00875f' : 'transparent'}
            width='full'
            h={50}
            _text={styles.buttonText}
          >
            Criar conta
          </Button>
          {
            createPassword
            && <Text
              onPress={() => setCreatePassword(false)}
              color='#fff'
              alignSelf='center'
            >
              Já possui uma conta? Faça Login
            </Text>
          }
        </VStack>
      </VStack>
      <Modal animationPreset='slide' isOpen={forgotPassword} onClose={() => setForgotPassword(false)} safeAreaTop={true}>
        <Modal.Content
          bg='#202024'
          width='full'
        >
          <Modal.CloseButton />
          <Modal.Body>
            <Text color='#fff' fontSize={18} fontWeight='bold'>Esqueceu sua senha?</Text>
            <FormControl isInvalid={isEmailValid} mt={5}>
              <Input
                variant='underlined'
                placeholder='E-mail'
                placeholderTextColor='#fff'
                _focus={{ borderColor: '#00875f' }}
                color='#fff'
                value={email}
                onChangeText={setEmail}
                size='xl'
                isRequired
              />
              <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size='xs' />}>
                <Text>Esse campo está vazio ou não está no formato de um email, ex: email@ex.com</Text>
              </FormControl.ErrorMessage>
            </FormControl>
          </Modal.Body>
          <Modal.Footer mt={4} bg='#202024' borderColor='#202024'>
            <Button.Group space={4}>
              <Button variant='ghost' _text={styles.buttonText} onPress={() => setForgotPassword(false)}>
                Cancelar
              </Button>
              <Button
                width='120px'
                h={50}
                bgColor='#00875f'
                _text={styles.buttonText}
                onPress={() => handleResetPassword()}
              >
                Enviar
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Modal
        isOpen={loginLoading}
        alignSelf='center'
        width='full'
        height='full'
        bg='#202024d3'
        justifyContent='center'
      >
        <ActivityIndicator size={56} color='#00875f' />
      </Modal>
    </Center>
  )
}

export default Login;

const styles = StyleSheet.create({
  image: {
    width: 186,
    height: 186,
    alignSelf: 'center'
  },
  buttonText: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: '#fff'
  }
})