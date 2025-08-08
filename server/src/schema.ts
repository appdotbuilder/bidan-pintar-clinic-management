import { z } from 'zod';

// Patient schema
export const patientSchema = z.object({
  id: z.number(),
  nama_lengkap: z.string(),
  tanggal_lahir: z.coerce.date(),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
  alamat: z.string(),
  nomor_telepon: z.string().nullable(),
  nomor_identitas: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Patient = z.infer<typeof patientSchema>;

// Medicine schema
export const medicineSchema = z.object({
  id: z.number(),
  nama_obat: z.string(),
  jenis_obat: z.string(),
  satuan: z.string(),
  harga_beli: z.number(),
  harga_jual: z.number(),
  stok_minimum: z.number().int(),
  stok_saat_ini: z.number().int(),
  tanggal_kadaluarsa: z.coerce.date().nullable(),
  keterangan: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Medicine = z.infer<typeof medicineSchema>;

// Medicine stock movement schema
export const stockMovementSchema = z.object({
  id: z.number(),
  medicine_id: z.number(),
  jenis_pergerakan: z.enum(['Masuk', 'Keluar']),
  jumlah: z.number().int(),
  keterangan: z.string().nullable(),
  created_at: z.coerce.date()
});

export type StockMovement = z.infer<typeof stockMovementSchema>;

// Transaction schema
export const transactionSchema = z.object({
  id: z.number(),
  patient_id: z.number().nullable(),
  nomor_transaksi: z.string(),
  tanggal_transaksi: z.coerce.date(),
  total_amount: z.number(),
  status_pembayaran: z.enum(['Lunas', 'Belum Lunas']),
  metode_pembayaran: z.enum(['Tunai', 'Transfer Bank', 'Kartu Kredit']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Transaction = z.infer<typeof transactionSchema>;

// Transaction item schema
export const transactionItemSchema = z.object({
  id: z.number(),
  transaction_id: z.number(),
  medicine_id: z.number(),
  nama_item: z.string(),
  jumlah: z.number().int(),
  harga_satuan: z.number(),
  subtotal: z.number(),
  created_at: z.coerce.date()
});

export type TransactionItem = z.infer<typeof transactionItemSchema>;

// Patient visit schema
export const patientVisitSchema = z.object({
  id: z.number(),
  patient_id: z.number(),
  keluhan: z.string(),
  diagnosis: z.string().nullable(),
  tindakan: z.string().nullable(),
  biaya_konsultasi: z.number(),
  tanggal_kunjungan: z.coerce.date(),
  created_at: z.coerce.date()
});

export type PatientVisit = z.infer<typeof patientVisitSchema>;

// Application settings schema
export const appSettingsSchema = z.object({
  id: z.number(),
  nama_klinik: z.string(),
  alamat_klinik: z.string(),
  telepon_klinik: z.string().nullable(),
  logo_path: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type AppSettings = z.infer<typeof appSettingsSchema>;

// Input schemas for creating entities
export const createPatientInputSchema = z.object({
  nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  tanggal_lahir: z.coerce.date(),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']),
  alamat: z.string().min(1, 'Alamat wajib diisi'),
  nomor_telepon: z.string().nullable(),
  nomor_identitas: z.string().nullable()
});

export type CreatePatientInput = z.infer<typeof createPatientInputSchema>;

export const createMedicineInputSchema = z.object({
  nama_obat: z.string().min(1, 'Nama obat wajib diisi'),
  jenis_obat: z.string().min(1, 'Jenis obat wajib diisi'),
  satuan: z.string().min(1, 'Satuan wajib diisi'),
  harga_beli: z.number().positive('Harga beli harus positif'),
  harga_jual: z.number().positive('Harga jual harus positif'),
  stok_minimum: z.number().int().nonnegative('Stok minimum tidak boleh negatif'),
  stok_saat_ini: z.number().int().nonnegative('Stok saat ini tidak boleh negatif'),
  tanggal_kadaluarsa: z.coerce.date().nullable(),
  keterangan: z.string().nullable()
});

export type CreateMedicineInput = z.infer<typeof createMedicineInputSchema>;

export const createStockMovementInputSchema = z.object({
  medicine_id: z.number().positive('Medicine ID harus valid'),
  jenis_pergerakan: z.enum(['Masuk', 'Keluar']),
  jumlah: z.number().int().positive('Jumlah harus positif'),
  keterangan: z.string().nullable()
});

export type CreateStockMovementInput = z.infer<typeof createStockMovementInputSchema>;

export const createTransactionInputSchema = z.object({
  patient_id: z.number().positive().nullable(),
  metode_pembayaran: z.enum(['Tunai', 'Transfer Bank', 'Kartu Kredit']),
  items: z.array(z.object({
    medicine_id: z.number().positive(),
    nama_item: z.string(),
    jumlah: z.number().int().positive(),
    harga_satuan: z.number().positive()
  })).min(1, 'Minimal satu item harus ada')
});

export type CreateTransactionInput = z.infer<typeof createTransactionInputSchema>;

export const createPatientVisitInputSchema = z.object({
  patient_id: z.number().positive('Patient ID harus valid'),
  keluhan: z.string().min(1, 'Keluhan wajib diisi'),
  diagnosis: z.string().nullable(),
  tindakan: z.string().nullable(),
  biaya_konsultasi: z.number().nonnegative('Biaya konsultasi tidak boleh negatif')
});

export type CreatePatientVisitInput = z.infer<typeof createPatientVisitInputSchema>;

// Update schemas
export const updatePatientInputSchema = z.object({
  id: z.number().positive(),
  nama_lengkap: z.string().min(1).optional(),
  tanggal_lahir: z.coerce.date().optional(),
  jenis_kelamin: z.enum(['Laki-laki', 'Perempuan']).optional(),
  alamat: z.string().min(1).optional(),
  nomor_telepon: z.string().nullable().optional(),
  nomor_identitas: z.string().nullable().optional()
});

export type UpdatePatientInput = z.infer<typeof updatePatientInputSchema>;

export const updateMedicineInputSchema = z.object({
  id: z.number().positive(),
  nama_obat: z.string().min(1).optional(),
  jenis_obat: z.string().min(1).optional(),
  satuan: z.string().min(1).optional(),
  harga_beli: z.number().positive().optional(),
  harga_jual: z.number().positive().optional(),
  stok_minimum: z.number().int().nonnegative().optional(),
  stok_saat_ini: z.number().int().nonnegative().optional(),
  tanggal_kadaluarsa: z.coerce.date().nullable().optional(),
  keterangan: z.string().nullable().optional()
});

export type UpdateMedicineInput = z.infer<typeof updateMedicineInputSchema>;

export const updateAppSettingsInputSchema = z.object({
  nama_klinik: z.string().min(1).optional(),
  alamat_klinik: z.string().min(1).optional(),
  telepon_klinik: z.string().nullable().optional(),
  logo_path: z.string().nullable().optional()
});

export type UpdateAppSettingsInput = z.infer<typeof updateAppSettingsInputSchema>;

// Query schemas
export const getPatientByIdInputSchema = z.object({
  id: z.number().positive()
});

export type GetPatientByIdInput = z.infer<typeof getPatientByIdInputSchema>;

export const getMedicineByIdInputSchema = z.object({
  id: z.number().positive()
});

export type GetMedicineByIdInput = z.infer<typeof getMedicineByIdInputSchema>;

export const getTransactionByIdInputSchema = z.object({
  id: z.number().positive()
});

export type GetTransactionByIdInput = z.infer<typeof getTransactionByIdInputSchema>;

export const searchPatientsInputSchema = z.object({
  query: z.string().min(1, 'Query pencarian wajib diisi')
});

export type SearchPatientsInput = z.infer<typeof searchPatientsInputSchema>;

export const searchMedicinesInputSchema = z.object({
  query: z.string().min(1, 'Query pencarian wajib diisi')
});

export type SearchMedicinesInput = z.infer<typeof searchMedicinesInputSchema>;

// Dashboard data schema
export const dashboardDataSchema = z.object({
  total_patients: z.number(),
  total_medicines: z.number(),
  low_stock_medicines: z.number(),
  today_transactions: z.number(),
  today_revenue: z.number(),
  expired_medicines: z.number()
});

export type DashboardData = z.infer<typeof dashboardDataSchema>;