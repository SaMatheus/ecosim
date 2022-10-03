import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
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
  Modal,
  Divider
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { emailValidation } from '../../utils/validations';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [createAccount, setCreateAccount] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [loginLoading, setLoginLoadin] = useState(false)

  const fieldsValidation = () => {
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
      setIsPasswordValid(false)
      setIsEmailValid(false)
      return true
    }

    setLoginLoadin(false)
    return false;
  };

  const handleSignIn = async () => {
    setLoginLoadin(true);
    const validation = fieldsValidation();

    if (validation) {
      return auth()
        .signInWithEmailAndPassword(email, password)
        .then(() => {
          setLoginLoadin(false)
          navigation.navigate('Home')
        })
    }

    return false;
  };

  const handleSignInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo)
    } catch (error) {
      console.log(error)
    };
  };

  const handleSignUp = async () => {
    setLoginLoadin(true);
    const validation = fieldsValidation();

    if (validation) {
      return await auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          setLoginLoadin(false)
          setCreateAccount(false)
          handleSignIn()
        })
    }
  };

  const handleResetPassword = async () => {
    setLoginLoadin(true);
    setForgotPassword(false);

    return await auth()
      .sendPasswordResetEmail(email)
      .then(() => setLoginLoadin(false))
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '605928001302-qeqefdqrvaqf85imqm752vv32nb1rlbi.apps.googleusercontent.com'
    });
  }, [])

  return (
    <Center height='full' bg='#121214' safeAreaTop>
      <VStack
        alignSelf='center'
        justifyContent='center'
        width='full'
        pr={10}
        pl={10}
        space={12}
      >
        <Image style={styles.image} source={require('../../assets/login-icon.png')} alt='logomarca' />
        <VStack h={createAccount ? 220 : 160} space={8}>
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
                  !createAccount
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
            {!createAccount
              && <Text color='#fff' mt={2} alignSelf='flex-end' onPress={() => setForgotPassword(true)}>Esqueceu sua senha?</Text>
            }
          </Box>
          {
            createAccount && (
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
            !createAccount && (
              <Button
                onPress={handleSignIn}
                bgColor='#00875f'
                width='full'
                h={50}
                _text={styles.buttonText}
              >
                Entrar
              </Button>
            )
          }
          <Button
            variant={createAccount ? 'solid' : 'unstyled'}
            onPress={createAccount ? handleSignUp : () => setCreateAccount(true)}
            bgColor={createAccount ? '#00875f' : 'transparent'}
            width='full'
            h={50}
            _text={styles.buttonText}
          >
            Criar conta
          </Button>
          {
            createAccount
            && <Text
              onPress={() => setCreateAccount(false)}
              color='#fff'
              alignSelf='center'
            >
              Já possui uma conta? Faça Login
            </Text>
          }
          {
            !createAccount && (
              <Box alignItems='center'>
                <Box mb={4} flexDirection='row' alignItems='center'>
                  <Divider w={20} /><Text color='#fff' ml={2} mr={2}>OU</Text><Divider w={20} />
                </Box>
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Icon}
                  onPress={handleSignInWithGoogle}
                />
              </Box>
            )
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
  },
  googleButton: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    heigh: '50px',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  }
});
