/**
 * =========================================
 * UTILIDADES DE ENCRIPTACIÓN
 * Fase 1: Fundación - Encriptación y Seguridad
 * =========================================
 */

import CryptoJS from 'crypto-js';

/**
 * ==========================================
 * CONFIGURACIÓN DE ENCRIPTACIÓN
 * ==========================================
 */

// Obtener clave secreta del entorno
const getEncryptionKey = () => {
  const key = process.env.ENCRYPTION_SECRET || process.env.NEXT_PUBLIC_ENCRYPTION_SECRET;
  if (!key) {
    throw new Error('ENCRYPTION_SECRET no está configurado en las variables de entorno');
  }
  return key;
};

// Configuración de encriptación
const ENCRYPTION_CONFIG = {
  algorithm: 'AES',
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
  keySize: 256 / 32, // 256 bits
  ivSize: 128 / 32   // 128 bits
};

/**
 * ==========================================
 * FUNCIONES DE ENCRIPTACIÓN PRINCIPAL
 * ==========================================
 */

/**
 * Encriptar datos sensibles
 * @param {any} data - Datos a encriptar
 * @returns {string} Datos encriptados en base64
 */
export const encryptSensitiveData = (data) => {
  try {
    if (!data) return null;

    const secretKey = getEncryptionKey();
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Generar IV aleatorio
    const iv = CryptoJS.lib.WordArray.random(ENCRYPTION_CONFIG.ivSize);
    
    // Encriptar
    const encrypted = CryptoJS.AES.encrypt(dataString, secretKey, {
      iv: iv,
      mode: ENCRYPTION_CONFIG.mode,
      padding: ENCRYPTION_CONFIG.padding
    });
    
    // Combinar IV y datos encriptados
    const result = iv.concat(encrypted.ciphertext);
    
    return result.toString(CryptoJS.enc.Base64);
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Error al encriptar datos sensibles');
  }
};

/**
 * Desencriptar datos sensibles
 * @param {string} encryptedData - Datos encriptados en base64
 * @returns {any} Datos desencriptados
 */
export const decryptSensitiveData = (encryptedData) => {
  try {
    if (!encryptedData) return null;

    const secretKey = getEncryptionKey();
    
    // Convertir de base64 a WordArray
    const combined = CryptoJS.enc.Base64.parse(encryptedData);
    
    // Extraer IV y datos encriptados
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, ENCRYPTION_CONFIG.ivSize));
    const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(ENCRYPTION_CONFIG.ivSize));
    
    // Desencriptar
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      secretKey,
      {
        iv: iv,
        mode: ENCRYPTION_CONFIG.mode,
        padding: ENCRYPTION_CONFIG.padding
      }
    );
    
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Error al desencriptar: datos corruptos o clave incorrecta');
    }
    
    // Intentar parsear como JSON, si falla devolver como string
    try {
      return JSON.parse(decryptedString);
    } catch {
      return decryptedString;
    }
  } catch (error) {
    console.error('Error decrypting data:', error);
    throw new Error('Error al desencriptar datos sensibles');
  }
};

/**
 * ==========================================
 * FUNCIONES ESPECÍFICAS PARA VENDEDORES
 * ==========================================
 */

/**
 * Encriptar información bancaria
 * @param {Object} bankInfo - Información bancaria
 * @returns {string} Información bancaria encriptada
 */
export const encryptBankInfo = (bankInfo) => {
  if (!bankInfo) return null;
  
  // Sanitizar datos antes de encriptar
  const sanitizedBankInfo = {
    bankName: bankInfo.bankName?.trim(),
    accountNumber: bankInfo.accountNumber?.replace(/\D/g, ''), // Solo números
    routingNumber: bankInfo.routingNumber?.replace(/\D/g, ''), // Solo números
    accountType: bankInfo.accountType,
    // Agregar timestamp para auditoria
    encryptedAt: new Date().toISOString(),
    // Hash para verificación de integridad (sin datos sensibles)
    checksum: CryptoJS.SHA256(
      `${bankInfo.bankName}-${bankInfo.accountType}-${Date.now()}`
    ).toString()
  };
  
  return encryptSensitiveData(sanitizedBankInfo);
};

/**
 * Desencriptar información bancaria
 * @param {string} encryptedBankInfo - Información bancaria encriptada
 * @returns {Object} Información bancaria desencriptada
 */
export const decryptBankInfo = (encryptedBankInfo) => {
  if (!encryptedBankInfo) return null;
  
  const decrypted = decryptSensitiveData(encryptedBankInfo);
  
  // Validar integridad básica
  if (!decrypted || !decrypted.accountNumber || !decrypted.routingNumber) {
    throw new Error('Información bancaria corrupta o incompleta');
  }
  
  return decrypted;
};

/**
 * Encriptar número de licencia
 * @param {string} licenseNumber - Número de licencia
 * @param {string} state - Estado donde está registrada
 * @returns {string} Licencia encriptada
 */
export const encryptLicenseNumber = (licenseNumber, state) => {
  if (!licenseNumber) return null;
  
  const licenseData = {
    number: licenseNumber.trim().toUpperCase(),
    state: state?.trim().toUpperCase(),
    encryptedAt: new Date().toISOString(),
    checksum: CryptoJS.SHA256(`${licenseNumber}-${state}`).toString()
  };
  
  return encryptSensitiveData(licenseData);
};

/**
 * Desencriptar número de licencia
 * @param {string} encryptedLicense - Licencia encriptada
 * @returns {Object} Datos de licencia desencriptados
 */
export const decryptLicenseNumber = (encryptedLicense) => {
  if (!encryptedLicense) return null;
  
  const decrypted = decryptSensitiveData(encryptedLicense);
  
  if (!decrypted || !decrypted.number) {
    throw new Error('Información de licencia corrupta');
  }
  
  return decrypted;
};

/**
 * ==========================================
 * UTILIDADES DE HASH
 * ==========================================
 */

/**
 * Crear hash seguro (irreversible) para búsquedas
 * @param {string} data - Datos a hashear
 * @param {string} salt - Salt opcional
 * @returns {string} Hash SHA256
 */
export const createSecureHash = (data, salt = '') => {
  if (!data) return null;
  
  const saltedData = `${data}${salt}${getEncryptionKey().slice(-8)}`;
  return CryptoJS.SHA256(saltedData).toString();
};

/**
 * Crear hash para búsqueda de email (permite búsquedas sin revelar el email)
 * @param {string} email - Email a hashear
 * @returns {string} Hash del email
 */
export const createEmailHash = (email) => {
  if (!email) return null;
  return createSecureHash(email.toLowerCase().trim(), 'email_search');
};

/**
 * Crear hash para búsqueda de licencia
 * @param {string} licenseNumber - Número de licencia
 * @param {string} state - Estado
 * @returns {string} Hash de la licencia
 */
export const createLicenseHash = (licenseNumber, state) => {
  if (!licenseNumber) return null;
  const combined = `${licenseNumber.toUpperCase()}_${state?.toUpperCase() || ''}`;
  return createSecureHash(combined, 'license_search');
};

/**
 * ==========================================
 * VALIDACIÓN Y VERIFICACIÓN
 * ==========================================
 */

/**
 * Verificar integridad de datos encriptados
 * @param {string} encryptedData - Datos encriptados
 * @param {string} expectedChecksum - Checksum esperado
 * @returns {boolean} Datos íntegros
 */
export const verifyDataIntegrity = (encryptedData, expectedChecksum) => {
  try {
    const decrypted = decryptSensitiveData(encryptedData);
    return decrypted?.checksum === expectedChecksum;
  } catch {
    return false;
  }
};

/**
 * Verificar si los datos están encriptados correctamente
 * @param {string} encryptedData - Datos encriptados
 * @returns {boolean} Es válido
 */
export const isValidEncryption = (encryptedData) => {
  if (!encryptedData || typeof encryptedData !== 'string') {
    return false;
  }

  try {
    // Intentar decodificar base64
    const decoded = CryptoJS.enc.Base64.parse(encryptedData);
    
    // Verificar que tenga la longitud mínima (IV + datos)
    return decoded.words.length >= ENCRYPTION_CONFIG.ivSize;
  } catch {
    return false;
  }
};

/**
 * ==========================================
 * UTILIDADES DE DESARROLLO/DEBUG
 * ==========================================
 */

/**
 * Generar clave de encriptación aleatoria (solo para desarrollo)
 * @returns {string} Clave aleatoria
 */
export const generateRandomKey = () => {
  return CryptoJS.lib.WordArray.random(256/8).toString();
};

/**
 * Obtener información sobre datos encriptados (sin desencriptar)
 * @param {string} encryptedData - Datos encriptados
 * @returns {Object} Información de metadatos
 */
export const getEncryptionInfo = (encryptedData) => {
  if (!encryptedData) return null;

  try {
    const decoded = CryptoJS.enc.Base64.parse(encryptedData);
    
    return {
      isValid: isValidEncryption(encryptedData),
      sizeBytes: encryptedData.length,
      estimatedOriginalSize: Math.floor(decoded.words.length * 4 * 0.75), // Aproximación
      hasMinimumIVSize: decoded.words.length >= ENCRYPTION_CONFIG.ivSize
    };
  } catch {
    return {
      isValid: false,
      error: 'No se puede analizar el formato de encriptación'
    };
  }
};

/**
 * ==========================================
 * MIDDLEWARE DE ENCRIPTACIÓN
 * ==========================================
 */

/**
 * Middleware para encriptar automáticamente campos sensibles en un objeto
 * @param {Object} data - Objeto con datos
 * @param {Array} fieldsToEncrypt - Campos a encriptar
 * @returns {Object} Objeto con campos encriptados
 */
export const encryptObjectFields = (data, fieldsToEncrypt = []) => {
  if (!data || typeof data !== 'object') return data;

  const result = { ...data };

  fieldsToEncrypt.forEach(field => {
    if (result[field] !== undefined) {
      result[field] = encryptSensitiveData(result[field]);
    }
  });

  return result;
};

/**
 * Middleware para desencriptar automáticamente campos en un objeto
 * @param {Object} data - Objeto con datos encriptados
 * @param {Array} fieldsToDecrypt - Campos a desencriptar
 * @returns {Object} Objeto con campos desencriptados
 */
export const decryptObjectFields = (data, fieldsToDecrypt = []) => {
  if (!data || typeof data !== 'object') return data;

  const result = { ...data };

  fieldsToDecrypt.forEach(field => {
    if (result[field]) {
      try {
        result[field] = decryptSensitiveData(result[field]);
      } catch (error) {
        console.error(`Error decrypting field ${field}:`, error);
        result[field] = null; // O mantener encriptado según la lógica de negocio
      }
    }
  });

  return result;
};

/**
 * ==========================================
 * CONSTANTES Y CONFIGURACIÓN
 * ==========================================
 */

export const ENCRYPTION_CONSTANTS = {
  ALGORITHM: 'AES-256-CBC',
  KEY_SIZE: 256,
  IV_SIZE: 128,
  MAX_DATA_SIZE: 1024 * 1024, // 1MB máximo por campo
  ENCRYPTED_FIELDS: {
    SELLER: ['bank_info', 'license_number', 'ssn', 'tax_id'],
    DOCUMENTS: ['file_content', 'metadata'],
    PERSONAL: ['phone', 'address', 'identification']
  }
};

// Verificar configuración al importar el módulo
if (typeof window === 'undefined') { // Solo en servidor
  try {
    getEncryptionKey();
  } catch (error) {
    console.warn('Advertencia: Configuración de encriptación no disponible:', error.message);
  }
}
