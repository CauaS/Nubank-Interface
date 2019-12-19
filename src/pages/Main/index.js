import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Animated } from 'react-native';
import  { PanGestureHandler, State } from 'react-native-gesture-handler';

import Header from '~/components/Header/index';
import Tabs from '~/components/Tabs/index';
import Menu from '~/components/Menu/index';

import { Container, Content,  Card, CardHeader, CardContent, Tittle, Decription, CardFooter, Annotaion } from './styles.js';

export default function Main () {
  // 12 - offSet guarda a info de quantos pixel do usuário arrastou o card para baixo o pra cima;
  let offSet = 0;

  // 4 - estacia uma cont que vai atualizar várias durante do processo
    const translateY = new Animated.Value(0);
  
    // 5 - animatedEvent vai captar a posição que o usuário está arrantando e passar para translateY;
    const animatedEvent = Animated.event(
      // nativeEvent = captura o x e y;
      [
        {
          nativeEvent: {
            translationY: translateY,
          },
        },
      ],
      { useNativeDriver: true },
    );


  function onHandlerStateChanged(event){
    // 3 - vai receber todos os eventos após a movimentação iniciar
    // 13 - verifica se o estado do evento anterior era ativo, por que agora não mais, ele terminou a animação
    if(event.nativeEvent.oldState == State.ACTIVE){

      //armazena ao total de pixes movimentados pelo usuario
      const { translationY } = event.nativeEvent;
      
      // verifica se o menu está aberto
      let opened = false;


      // atualiza a var para o valor de translationY
      offSet += translationY;

      // quando a animação terminou, a proxima ira começar apatir desse ponto (offSet);
      /* 
        translateY.setOffset(offSet);
        translateY.setValue(0);
      */

      if(translationY >= 100) {
        opened = true;        
      } else {

        //seta ao valor de translateY para o off se for menor que 100;
        translateY.setValue(offSet);

        //joga o offSet para zero;
        translateY.setOffset(0);

        
        offSet = 0;
      }

      // oque vou animar =  translateY;
        //para qual valor = 380;
        // duração em ms;
        Animated.timing(translateY,  {
          toValue: opened ? 380 : 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          // Essa funcão de callbak funciiona ao finaliar uma animação
          // o off set é setado conforme o opened;
          offSet = opened ? 380 : 0;

          translateY.setOffset(offSet);
          translateY.setValue(0);
        });

    }
  }

  return (
    <Container>
        <Header/>         
        <Content>
          
          <Menu 
          // 9
            translateY={translateY} 
          />
          
          <PanGestureHandler
          /* 1 e 2*/
            onGestureEvent={animatedEvent}
            onHandlerStateChange={onHandlerStateChanged}
          >
            <Card 
            // 8 - Interpolete seta um limite no caso, somente do 0 ao 380 para descer;
              style={{
                transform: [{
                  translateY: translateY.interpolate({
                    inputRange: [-350, 0, 380],
                    outputRange: [-50, 0, 380],
                    extrapolate: 'clamp',
                  }),
                }],
              }}
            >
              <CardHeader>
                <Icon name="attach-money" size={28} color="#666"/>
                <Icon name="visibility-off" size={28} color="#666"/>
              </CardHeader>
              <CardContent>
                <Tittle>Saldo Disponível</Tittle>
                <Decription>R$ 7.611,58</Decription>
              </CardContent>
              <CardFooter>
                <Annotaion>Transferência de R$ 20,00 recebida.</Annotaion>
              </CardFooter>
            </Card>
          </PanGestureHandler>
        </Content>

        <Tabs translateY={translateY} />
    </Container>
  )
}