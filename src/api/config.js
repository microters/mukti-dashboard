// src/api/config.js
/**
 * API Configuration file
 * Contains all API-related settings and constants
 */

// API Authentication and Connection
export const API_KEY = "caf56e69405fe970f918e99ce86a80fbf0a7d728cca687e8a433b817411a6079";
export const BASE_URL = "https://api.muktihospital.com/api";

// Request Configuration
export const REQUEST_TIMEOUT = 30000; // 30 seconds
export const ENABLE_RETRIES = true;
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 second
export const RETRY_STATUS_CODES = [408, 429, 500, 502, 503, 504];

// API Endpoints
export const ENDPOINTS = {
  // Doctor endpoints
  DOCTORS: {
    LIST: "/doctor",
    DETAIL: (id) => `/doctor/${id}`,
    ADD: "/doctor/add",
    EDIT: (id) => `/doctor/edit/${id}`,
    DELETE: (id) => `/doctor/delete/${id}`
  },
  
  // Patient endpoints
  PATIENTS: {
    LIST: "/patient",
    DETAIL: (id) => `/patient/${id}`,
    ADD: "/patient/add",
    EDIT: (id) => `/patient/edit/${id}`,
    DELETE: (id) => `/patient/delete/${id}`
  },
  
  // Appointment endpoints
  APPOINTMENTS: {
    LIST: "/appointment",
    DETAIL: (id) => `/appointment/${id}`,
    ADD: "/appointment/add",
    EDIT: (id) => `/appointment/edit/${id}`,
    DELETE: (id) => `/appointment/delete/${id}`
  },
  
  // Schedule endpoints
  SCHEDULES: {
    LIST: "/schedule",
    DETAIL: (id) => `/schedule/${id}`,
    ADD: "/schedule/add",
    EDIT: (id) => `/schedule/edit/${id}`,
    DELETE: (id) => `/schedule/delete/${id}`
  }
};

// Default headers for all requests
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY
};

// Form options
export const BLOOD_GROUPS = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "O_NEGATIVE", label: "O-" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "AB_NEGATIVE", label: "AB-" }
];

export const PAYMENT_METHODS = [
  { value: "CASH", label: "Cash" },
  { value: "BKASH", label: "Bkash" },
  { value: "NAGAD", label: "Nagad" },
  { value: "ROCKET", label: "Rocket" },
  { value: "BANK", label: "Bank" }
];

// Helper functions
export const formatBloodGroup = (bloodGroup) => {
  if (!bloodGroup) return "";
  return bloodGroup.replace("_POSITIVE", "+").replace("_NEGATIVE", "-");
};

export const parseBloodGroup = (bloodGroup) => {
  if (!bloodGroup) return "";
  return bloodGroup.replace("+", "_POSITIVE").replace("-", "_NEGATIVE");
};