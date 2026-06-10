import React, { createContext, useContext, useReducer, useEffect } from 'react';
import {
  INITIAL_HORSES, INITIAL_STOCK, INITIAL_VITAMINS,
  INITIAL_PURCHASES, INITIAL_EVENTS, INITIAL_CONSUMPTION,
  INITIAL_CONSUMPTION_LOG,
} from './initial';

const LS_KEY = 'equino_v5';

function loadState() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function getInitial() {
  return {
    horses: INITIAL_HORSES,
    stock: INITIAL_STOCK,
    vitamins: INITIAL_VITAMINS,
    purchases: INITIAL_PURCHASES,
    events: INITIAL_EVENTS,
    consumption14: INITIAL_CONSUMPTION,
    consumptionLog: INITIAL_CONSUMPTION_LOG,
    userName: 'Mariana',
    onboarded: false,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_HORSE': {
      const id = 'h' + Date.now();
      const h = { ...action.horse, id, initial: action.horse.name.charAt(0).toUpperCase() };
      return { ...state, horses: [...state.horses, h] };
    }
    case 'UPDATE_HORSE': {
      return {
        ...state,
        horses: state.horses.map(h => h.id === action.horse.id ? { ...h, ...action.horse } : h),
      };
    }
    case 'DELETE_HORSE':
      return { ...state, horses: state.horses.filter(h => h.id !== action.id) };

    case 'UPDATE_STOCK': {
      return {
        ...state,
        stock: state.stock.map(s => s.id === action.id ? { ...s, ...action.updates } : s),
      };
    }
    case 'ADD_PURCHASE': {
      const p = { ...action.purchase, id: 'p' + Date.now() };
      const newStock = state.stock.map(s => {
        if (s.id === action.stockId) {
          return {
            ...s,
            stock: s.stock + Number(action.purchase.qty),
            lastEntry: { date: action.purchase.date, qty: Number(action.purchase.qty), price: Number(action.purchase.price) },
          };
        }
        return s;
      });
      return { ...state, purchases: [p, ...state.purchases], stock: newStock };
    }

    case 'ADD_VITAMIN': {
      const v = { ...action.vitamin, id: 'v' + Date.now() };
      return { ...state, vitamins: [...state.vitamins, v] };
    }
    case 'UPDATE_VITAMIN': {
      return {
        ...state,
        vitamins: state.vitamins.map(v => v.id === action.vitamin.id ? { ...v, ...action.vitamin } : v),
      };
    }

    case 'ADD_EVENT': {
      const e = { ...action.event, id: 'ev' + Date.now() };
      return { ...state, events: [...state.events, e].sort((a, b) => a.date.localeCompare(b.date)) };
    }
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(e => e.id !== action.id) };

    case 'LOG_CONSUMPTION': {
      const entry = { id: 'c' + Date.now(), ...action.entry };
      const arr = [...state.consumption14.slice(-13), action.entry.kg];
      const newStock = action.entry.stockId
        ? state.stock.map(s => s.id === action.entry.stockId
            ? { ...s, stock: Math.max(0, s.stock - action.entry.kg) }
            : s)
        : state.stock;
      return {
        ...state,
        consumption14: arr,
        consumptionLog: [...(state.consumptionLog || []), entry],
        stock: newStock,
      };
    }

    case 'COMPLETE_ONBOARDING': {
      const newHorses = action.horses.map((h, i) => ({
        id: 'h' + (Date.now() + i),
        name: h.name,
        sex: h.sex,
        breed: '',
        color: h.sex === 'stallion' ? '#4a3728' : h.sex === 'gelding' ? '#8a8070' : h.sex === 'foal' ? '#f5f0e8' : '#c8b89a',
        birthDate: '',
        status: h.sex === 'stallion' ? 'reproductor' : h.sex === 'gelding' ? 'trabajo' : h.sex === 'foal' ? 'cría' : 'vacía',
        initial: h.name.charAt(0).toUpperCase(),
        tile: h.sex,
        covers: 0,
      }));
      const newStock = state.stock.map(s => ({
        ...s,
        stock: 0,
        capacity: s.id === 'heno' ? action.capacities.heno
                : s.id === 'alfalfa' ? action.capacities.alfalfa
                : s.id === 'concentrado' ? action.capacities.concentrado
                : s.capacity,
        dailyUse: 0,
        lastEntry: null,
      }));
      return {
        ...state,
        userName: action.name,
        horses: newHorses,
        stock: newStock,
        vitamins: [],
        purchases: [],
        events: [],
        consumption14: [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        consumptionLog: [],
        onboarded: true,
      };
    }

    case 'SET_USERNAME':
      return { ...state, userName: action.name };

    default:
      return state;
  }
}

const StoreCtx = createContext(null);

export function StoreProvider({ children }) {
  const saved = loadState();
  const [state, dispatch] = useReducer(reducer, saved || getInitial());

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state]);

  return React.createElement(StoreCtx.Provider, { value: { state, dispatch } }, children);
}

export function useStore() {
  return useContext(StoreCtx);
}

// helpers
export function daysBetween(a, b) {
  const ms = new Date(b) - new Date(a);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
export function fmtDate(d, opts = { day: 'numeric', month: 'short' }) {
  return new Date(d).toLocaleDateString('es-CO', opts);
}
export function fmtMoney(n) {
  return '$' + Number(n).toLocaleString('es-CO');
}
export function ageInMonths(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  return Math.max(0, (TODAY.getFullYear() - birth.getFullYear()) * 12 + (TODAY.getMonth() - birth.getMonth()));
}
export const TODAY = new Date(2026, 4, 27);
