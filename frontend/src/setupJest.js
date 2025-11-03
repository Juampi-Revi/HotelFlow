import { TextEncoder, TextDecoder } from 'util';

// Polyfills for jsdom
global.TextEncoder = TextEncoder;
// TextDecoder requires a label parameter in some cases; provide utf-8 default
global.TextDecoder = TextDecoder;

// Mock react-router-dom to avoid needing a Router in unit tests
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: '/',
    search: '',
    hash: '',
    state: null,
    key: 'test'
  }),
}));