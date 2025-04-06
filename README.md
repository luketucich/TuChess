# TuChess - Deployed at [Tuchess.com](https://www.tuchess.com/)

TuChess is a real-time multiplayer chess platform built with modern web technologies. Players can challenge each other to games with various time controls, play chess with full rule enforcement, and enjoy features like piece promotion, timers, and reconnection support.

<img width="427.5" alt="Screenshot 2025-04-06 at 2 43 10 PM" src="https://github.com/user-attachments/assets/7ce55a3d-7947-44ea-a7b3-c848997ede99" />
<img width="300" alt="Screenshot 2025-04-06 at 2 44 01 PM" src="https://github.com/user-attachments/assets/ef6f5247-9ae5-4ff7-8e6e-2cd1f90c8738" />


## Features

- **Real-time multiplayer** chess games using WebSockets
- **Multiple time controls** (Bullet, Blitz, Rapid, Classical)
- **Board theme customization** options
- **Google authentication** support
- **Game timers** with increment options
- **Automatic game state saving** (using Supabase)
- **Reconnection support** if a player disconnects
- **Comprehensive rule enforcement** including:
  - Castling
  - En passant
  - Pawn promotion
  - Check and checkmate detection
  - Stalemate detection

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Socket.IO** client for real-time communication
- **Supabase** client for authentication
- **Custom CSS** for styling

### Backend
- **Node.js** with TypeScript
- **Express** for HTTP server
- **Socket.IO** for WebSocket communication
- **Supabase** for database and authentication

### Testing
- **Vitest** for unit testing

## Architecture

The application follows a client-server architecture:

1. The frontend is a React SPA (Single Page Application) that handles chess board rendering, user interaction, and real-time updates.
2. The backend manages game state, validates moves, handles player connections/disconnections, and synchronizes timers.
3. Communication between client and server happens via Socket.IO for real-time updates.
4. Game states are stored in Supabase for persistence and later analysis.

## What I Learned

Throughout this project, I gained experience in:

- Building and managing complex state in real-time applications
- Implementing game logic with TypeScript's advanced type system
- Working with WebSockets for bidirectional real-time communication
- Handling user authentication and authorization
- Managing timers and time-sensitive operations
- Designing reconnection flows for improved user experience
- Unit testing complex game logic
- Structuring a full-stack application with clean separation of concerns

## Future Improvements

- Implement puzzles and chess challenges
- Allow players to create/join custom games
- Add game analysis tools
- Introduce a rating system
- Support for creating tournaments
- Additional board themes and piece sets
- Mobile app version

## Acknowledgements

- [React Feather](https://github.com/feathericons/react-feather) - Icons used in the UI
- [Chess Piece SVGs](https://github.com/lichess-org/lila) - Chess pieces used in the UI

## License

This project is licensed under the MIT License - see the LICENSE file for details.
