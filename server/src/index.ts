import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import { 
  createPatientInputSchema,
  updatePatientInputSchema,
  getPatientByIdInputSchema,
  searchPatientsInputSchema,
  createMedicineInputSchema,
  updateMedicineInputSchema,
  getMedicineByIdInputSchema,
  searchMedicinesInputSchema,
  createStockMovementInputSchema,
  createTransactionInputSchema,
  getTransactionByIdInputSchema,
  createPatientVisitInputSchema,
  updateAppSettingsInputSchema
} from './schema';

// Import handlers
import { createPatient } from './handlers/create_patient';
import { getPatients } from './handlers/get_patients';
import { getPatientById } from './handlers/get_patient_by_id';
import { updatePatient } from './handlers/update_patient';
import { searchPatients } from './handlers/search_patients';

import { createMedicine } from './handlers/create_medicine';
import { getMedicines } from './handlers/get_medicines';
import { getMedicineById } from './handlers/get_medicine_by_id';
import { updateMedicine } from './handlers/update_medicine';
import { searchMedicines } from './handlers/search_medicines';
import { getLowStockMedicines } from './handlers/get_low_stock_medicines';
import { getExpiredMedicines } from './handlers/get_expired_medicines';

import { createStockMovement } from './handlers/create_stock_movement';
import { getStockMovements } from './handlers/get_stock_movements';

import { createTransaction } from './handlers/create_transaction';
import { getTransactions } from './handlers/get_transactions';
import { getTransactionById } from './handlers/get_transaction_by_id';
import { getTodayTransactions } from './handlers/get_today_transactions';

import { createPatientVisit } from './handlers/create_patient_visit';
import { getPatientVisits } from './handlers/get_patient_visits';

import { getAppSettings } from './handlers/get_app_settings';
import { updateAppSettings } from './handlers/update_app_settings';

import { getDashboardData } from './handlers/get_dashboard_data';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Patient management routes
  createPatient: publicProcedure
    .input(createPatientInputSchema)
    .mutation(({ input }) => createPatient(input)),

  getPatients: publicProcedure
    .query(() => getPatients()),

  getPatientById: publicProcedure
    .input(getPatientByIdInputSchema)
    .query(({ input }) => getPatientById(input)),

  updatePatient: publicProcedure
    .input(updatePatientInputSchema)
    .mutation(({ input }) => updatePatient(input)),

  searchPatients: publicProcedure
    .input(searchPatientsInputSchema)
    .query(({ input }) => searchPatients(input)),

  // Medicine management routes
  createMedicine: publicProcedure
    .input(createMedicineInputSchema)
    .mutation(({ input }) => createMedicine(input)),

  getMedicines: publicProcedure
    .query(() => getMedicines()),

  getMedicineById: publicProcedure
    .input(getMedicineByIdInputSchema)
    .query(({ input }) => getMedicineById(input)),

  updateMedicine: publicProcedure
    .input(updateMedicineInputSchema)
    .mutation(({ input }) => updateMedicine(input)),

  searchMedicines: publicProcedure
    .input(searchMedicinesInputSchema)
    .query(({ input }) => searchMedicines(input)),

  getLowStockMedicines: publicProcedure
    .query(() => getLowStockMedicines()),

  getExpiredMedicines: publicProcedure
    .query(() => getExpiredMedicines()),

  // Stock movement routes
  createStockMovement: publicProcedure
    .input(createStockMovementInputSchema)
    .mutation(({ input }) => createStockMovement(input)),

  getStockMovements: publicProcedure
    .query(() => getStockMovements()),

  // Transaction routes
  createTransaction: publicProcedure
    .input(createTransactionInputSchema)
    .mutation(({ input }) => createTransaction(input)),

  getTransactions: publicProcedure
    .query(() => getTransactions()),

  getTransactionById: publicProcedure
    .input(getTransactionByIdInputSchema)
    .query(({ input }) => getTransactionById(input)),

  getTodayTransactions: publicProcedure
    .query(() => getTodayTransactions()),

  // Patient visit routes
  createPatientVisit: publicProcedure
    .input(createPatientVisitInputSchema)
    .mutation(({ input }) => createPatientVisit(input)),

  getPatientVisits: publicProcedure
    .input(getPatientByIdInputSchema)
    .query(({ input }) => getPatientVisits(input.id)),

  // Application settings routes
  getAppSettings: publicProcedure
    .query(() => getAppSettings()),

  updateAppSettings: publicProcedure
    .input(updateAppSettingsInputSchema)
    .mutation(({ input }) => updateAppSettings(input)),

  // Dashboard route
  getDashboardData: publicProcedure
    .query(() => getDashboardData()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`Management System Bidan Pintar TRPC server listening at port: ${port}`);
}

start();