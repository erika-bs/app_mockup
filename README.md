# Spotify

Clone visual do Spotify feito em React Native com Expo, com:

- **14 telas** com navegação por Expo Router. (Login, cadastro,home,buscar,biblioteca,resultado,player, histórico de reprodução, playlist, artista, álbum, perfil, conta, ajuda)
- **API real**: todo o conteúdo musical (músicas, artistas, álbuns, capas e prévias) vem da iTunes Search API.
- **Armazenamento local** em três formas:
  - **SecureStore**: conta e senha do usuário.
  - **SQLite**: histórico de reprodução.
  - **AsyncStorage**: cache de buscas e músicas salvas.
- **Login com rotas protegidas**: sem conta logada, só a tela de login e cadastro ficam acessíveis.
- **Áudio real**: o player toca a prévia de 30 segundos fornecida pela API.

## Como rodar

    npm install
    npx expo start

Escaneie o QR code com o Expo Go (celular e computador na mesma rede Wi-Fi).