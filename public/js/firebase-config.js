// Lấy từ Firebase console → Project settings → Your apps → Web app → SDK setup and configuration.
// Các giá trị này không phải bí mật (chúng luôn lộ ra ở client); bảo mật nằm ở firestore.rules.
export const firebaseConfig = {
  apiKey: 'AIzaSyDzvhRJg4WiAlvl22qKsPrxlXLlKhSsGjw',
  authDomain: 'peter-tdn.firebaseapp.com',
  projectId: 'peter-tdn',
  storageBucket: 'peter-tdn.firebasestorage.app',
  messagingSenderId: '866654459824',
  appId: '1:866654459824:web:80525f5f3c83c727622875'
};

// Mặc định nối vào Firebase thật (kể cả khi mở ở localhost).
// Thêm ?emulator vào URL để dùng Firebase Emulator: http://localhost:5000/?emulator
export const USE_EMULATORS = new URLSearchParams(location.search).has('emulator');
