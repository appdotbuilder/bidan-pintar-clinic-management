import { serial, text, pgTable, timestamp, numeric, integer, date, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const jenisKelaminEnum = pgEnum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
export const jenisPergerakanEnum = pgEnum('jenis_pergerakan', ['Masuk', 'Keluar']);
export const statusPembayaranEnum = pgEnum('status_pembayaran', ['Lunas', 'Belum Lunas']);
export const metodePembayaranEnum = pgEnum('metode_pembayaran', ['Tunai', 'Transfer Bank', 'Kartu Kredit']);

// Patients table
export const patientsTable = pgTable('patients', {
  id: serial('id').primaryKey(),
  nama_lengkap: text('nama_lengkap').notNull(),
  tanggal_lahir: date('tanggal_lahir').notNull(),
  jenis_kelamin: jenisKelaminEnum('jenis_kelamin').notNull(),
  alamat: text('alamat').notNull(),
  nomor_telepon: text('nomor_telepon'),
  nomor_identitas: text('nomor_identitas'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Medicines table
export const medicinesTable = pgTable('medicines', {
  id: serial('id').primaryKey(),
  nama_obat: text('nama_obat').notNull(),
  jenis_obat: text('jenis_obat').notNull(),
  satuan: text('satuan').notNull(),
  harga_beli: numeric('harga_beli', { precision: 12, scale: 2 }).notNull(),
  harga_jual: numeric('harga_jual', { precision: 12, scale: 2 }).notNull(),
  stok_minimum: integer('stok_minimum').notNull(),
  stok_saat_ini: integer('stok_saat_ini').notNull(),
  tanggal_kadaluarsa: date('tanggal_kadaluarsa'),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Stock movements table
export const stockMovementsTable = pgTable('stock_movements', {
  id: serial('id').primaryKey(),
  medicine_id: integer('medicine_id').notNull().references(() => medicinesTable.id, { onDelete: 'cascade' }),
  jenis_pergerakan: jenisPergerakanEnum('jenis_pergerakan').notNull(),
  jumlah: integer('jumlah').notNull(),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Transactions table
export const transactionsTable = pgTable('transactions', {
  id: serial('id').primaryKey(),
  patient_id: integer('patient_id').references(() => patientsTable.id, { onDelete: 'set null' }),
  nomor_transaksi: text('nomor_transaksi').notNull().unique(),
  tanggal_transaksi: timestamp('tanggal_transaksi').defaultNow().notNull(),
  total_amount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  status_pembayaran: statusPembayaranEnum('status_pembayaran').notNull().default('Belum Lunas'),
  metode_pembayaran: metodePembayaranEnum('metode_pembayaran').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Transaction items table
export const transactionItemsTable = pgTable('transaction_items', {
  id: serial('id').primaryKey(),
  transaction_id: integer('transaction_id').notNull().references(() => transactionsTable.id, { onDelete: 'cascade' }),
  medicine_id: integer('medicine_id').notNull().references(() => medicinesTable.id, { onDelete: 'cascade' }),
  nama_item: text('nama_item').notNull(),
  jumlah: integer('jumlah').notNull(),
  harga_satuan: numeric('harga_satuan', { precision: 12, scale: 2 }).notNull(),
  subtotal: numeric('subtotal', { precision: 12, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Patient visits table
export const patientVisitsTable = pgTable('patient_visits', {
  id: serial('id').primaryKey(),
  patient_id: integer('patient_id').notNull().references(() => patientsTable.id, { onDelete: 'cascade' }),
  keluhan: text('keluhan').notNull(),
  diagnosis: text('diagnosis'),
  tindakan: text('tindakan'),
  biaya_konsultasi: numeric('biaya_konsultasi', { precision: 10, scale: 2 }).notNull(),
  tanggal_kunjungan: timestamp('tanggal_kunjungan').defaultNow().notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Application settings table
export const appSettingsTable = pgTable('app_settings', {
  id: serial('id').primaryKey(),
  nama_klinik: text('nama_klinik').notNull(),
  alamat_klinik: text('alamat_klinik').notNull(),
  telepon_klinik: text('telepon_klinik'),
  logo_path: text('logo_path'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const patientsRelations = relations(patientsTable, ({ many }) => ({
  visits: many(patientVisitsTable),
  transactions: many(transactionsTable)
}));

export const medicinesRelations = relations(medicinesTable, ({ many }) => ({
  stockMovements: many(stockMovementsTable),
  transactionItems: many(transactionItemsTable)
}));

export const stockMovementsRelations = relations(stockMovementsTable, ({ one }) => ({
  medicine: one(medicinesTable, {
    fields: [stockMovementsTable.medicine_id],
    references: [medicinesTable.id]
  })
}));

export const transactionsRelations = relations(transactionsTable, ({ one, many }) => ({
  patient: one(patientsTable, {
    fields: [transactionsTable.patient_id],
    references: [patientsTable.id]
  }),
  items: many(transactionItemsTable)
}));

export const transactionItemsRelations = relations(transactionItemsTable, ({ one }) => ({
  transaction: one(transactionsTable, {
    fields: [transactionItemsTable.transaction_id],
    references: [transactionsTable.id]
  }),
  medicine: one(medicinesTable, {
    fields: [transactionItemsTable.medicine_id],
    references: [medicinesTable.id]
  })
}));

export const patientVisitsRelations = relations(patientVisitsTable, ({ one }) => ({
  patient: one(patientsTable, {
    fields: [patientVisitsTable.patient_id],
    references: [patientsTable.id]
  })
}));

// TypeScript types for the table schemas
export type Patient = typeof patientsTable.$inferSelect;
export type NewPatient = typeof patientsTable.$inferInsert;

export type Medicine = typeof medicinesTable.$inferSelect;
export type NewMedicine = typeof medicinesTable.$inferInsert;

export type StockMovement = typeof stockMovementsTable.$inferSelect;
export type NewStockMovement = typeof stockMovementsTable.$inferInsert;

export type Transaction = typeof transactionsTable.$inferSelect;
export type NewTransaction = typeof transactionsTable.$inferInsert;

export type TransactionItem = typeof transactionItemsTable.$inferSelect;
export type NewTransactionItem = typeof transactionItemsTable.$inferInsert;

export type PatientVisit = typeof patientVisitsTable.$inferSelect;
export type NewPatientVisit = typeof patientVisitsTable.$inferInsert;

export type AppSettings = typeof appSettingsTable.$inferSelect;
export type NewAppSettings = typeof appSettingsTable.$inferInsert;

// Export all tables for proper query building
export const tables = {
  patients: patientsTable,
  medicines: medicinesTable,
  stockMovements: stockMovementsTable,
  transactions: transactionsTable,
  transactionItems: transactionItemsTable,
  patientVisits: patientVisitsTable,
  appSettings: appSettingsTable
};