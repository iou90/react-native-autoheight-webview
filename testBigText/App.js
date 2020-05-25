/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import AutoHeightWebView from 'react-native-autoheight-webview';

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <AutoHeightWebView
            source={{html}}
            zoomable={false}
            style={{width: Dimensions.get('window').width - 15}}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;

const html = `<p>Mastite Ambiental</p><p>Introdução:</p><p>Cada vez mais os produtores de leite estão focados no controle das mastites e melhorias na qualidade do leite. As mastites ambientais possuem um importante papel nesta “evolução” no controle das mastites, pois, quanto mais forem acompanhados os casos de mastite contagiosa, maior a chance de termos sérios problemas com agentes ambientais.</p><p>De fato, a mastite ambiental é o principal problema da maioria dos rebanhos bem gerenciados, sendo o Streptococus uberis o microrganismo mais comum.</p><p>Normalmente rebanhos que apresentam problemas com mastite ambiental possuem as seguintes características: mastite contagiosa reduzida a um nível mínimo; CCS inferiores a 200.000/ml e o nível de mastite clínica é alto. O manejo frequentemente parece ser muito bom, mas deficiências sutis, especialmente de higiene, podem ser identificadas numa avaliação cuidadosa dos procedimentos ambientais e de ordenha.</p><p>Etiologia:</p><p>Os microrganismos ambientais podem ser agrupados em três categorias:</p><p>Os estreptococos (exceto o S. agalactiae) como: Streptococus uberis, S. disgalactiae, S. bovis e S. parauberis;</p><p>As bactérias gram negativas, sobretudo os coliformes como: Escherichia coli, Klebsiella, Enterobacter, SerratiaI;</p><p>Outros patógenos como: Arcanobacterium pyogenes, Bacillus, Nocardia, Pseudomonas, leveduras, fungos e algas.</p><p>Sinais Clínicos:</p><p>Os sinais clínicos podem variar de leve até hiperagudo com a presença de alterações sistêmicas como febre, desidratação e toxemia. Na glândula mamária podemos notar inchaço, vermelhidão, dor, queda na produção de leite e alterações visuais no mesmo.</p><p>Diagnóstico:</p><p>Alguns sinais clínicos como inchaço e alterações macroscópicas no leite associados à anamnese pode nos indicar um caso ambiental, porém este é definido por meio de cultura bacteriológica.</p><p>Prevenção/Controle</p><p>Procedimentos que são eficazes no controle da mastite ambiental consistem em diminuição da umidade do ambiente e exposição dos tetos aos patógenos ambientais. Isto se aplica principalmente sobre o período seco, mas também durante a lactação, mantendo as vacas em pastos limpos, utilizando instalações bem projetadas, com ventilação adequada para permitir o conforto dos animais. Manter vacas secas e novilhas em ambiente que seja o mais seco possível, especialmente durante as duas semanas que antecedem o parto. Realizar uma excelente higiene antes da ordenha (pré-dipping) e colocar os conjuntos de ordenhas em tetos limpos e secos e utilizar pós-dipping.</p><p>Outros pontos importantes são os tratamentos de todos os quartos no momento da secagem; dieta balanceada; equipamentos revisados; vacinação com cepas de E. coli J5.</p><p>Tratamento</p><p>O tratamento desses casos está intimamente relacionado com o agente causador, pois, em alguns casos podemos lançar mão de um tratamento durante a lactação, e em outros, os melhores resultados são obtidos por meio da terapia com bisnagas de vacas secas (Bovigam® VS).</p><p>De toda forma, ao nos depararmos com um caso de mastite ambiental com alterações sistêmicas é fundamental entrarmos com um tratamento sintomático com extrema urgência, levando em conta que este animal corre risco de morte.</p><p>Nesse caso, o uso de potentes antibióticos de amplo espectro (Kinetomax®) é muito importante, pois a proliferação bacteriana é alta.</p><p>O uso de anti-inflamatórios não esteroidais (Flunamine®) inibem a dor, o inchaço e o processo inflamatório que estas bactérias causam.</p><p>Como tratamento tópico podemos utilizar antibióticos intramamários (Supronal® L ou Bovigam® L).</p><p>Uma eficiente hidratação pode surtir bons resultados nestes casos.</p><p>Fontes:</p><p>Blood, D.C. e Rodostits O.M. 2002. Clínica Veterinária. 9ª Edição. Editora Guanabara Koogan S.A., Rio de Janeiro, RJ.</p><p>Smith P. B. 2010. Medicina Interna de Grandes Animais. 4ª Edição. Editora Elsevier, Barcelona, Espanha.</p><p>Aiello S. E. 2001. Manual Merck de Veterinária. 8ª Edição. Editora Roca LTDA, São Paulo, SP.</p><p>Philpot W.N. e Nickerson S.C. 2002. Vencendo a Luta Contra a Mastite. Westfalia Surge Inc. São Paulo, SP.</p><p>Blowey R. e Edmondson P. 2010. Mastitis Control in Dairy Herds. 2ª Edição. Cab International, Oxfordshire, United Kingdon.</p>`;
