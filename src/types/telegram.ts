export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface InlineKeyboardButton {
  text: string;
  callback_data?: string;
  url?: string;
  web_app?: { url: string };
}

export interface ReplyKeyboardButton {
  text: string;
  request_contact?: boolean;
  request_location?: boolean;
}

export interface TelegramMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  photoUrl?: string;
  inlineKeyboard?: InlineKeyboardButton[][];
  replyKeyboard?: ReplyKeyboardButton[][];
}

export interface TelegramLog {
  id: string;
  timestamp: string;
  event: string;
  details: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
}

export interface OrderItem {
  id: string;
  user: string;
  phone: string;
  items: string;
  total: number;
  address: string;
  status: 'Pending' | 'Confirmed' | 'Preparing' | 'Ready' | 'Delivering' | 'Completed' | 'Cancelled';
  createdAt: string;
}
