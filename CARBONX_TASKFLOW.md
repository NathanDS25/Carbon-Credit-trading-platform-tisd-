# 🚀 CarbonX Remaining Taskflow

Follow these steps in order to get the platform fully operational.

## 1. Infrastructure Setup
- [x] **Database**: Ensure PostgreSQL is running. (DONE: Supabase)
- [x] **Prisma**: Run `npx prisma migrate dev --name init` inside the `server` folder to create your tables. (DONE)
- [x] **Redis**: Ensure a Redis server is running (locally or via Docker) on port 6379 for the Bull queue. (DONE: Upstash)

## 2. Blockchain Deployment
- [x] **Deploy Contract**: (DONE: 0x6E97...fE28)
- [x] **Update .env**: (DONE)

## 3. API Keys & Credentials
- [ ] **Firebase**: 
    - Create a project in Firebase Console.
    - Go to Project Settings > Service Accounts.
    - Generate a new private key and paste the details into `server/.env`.
- [ ] **Alchemy**:
    - Create a Sepolia app and get your RPC URL.
- [ ] **AWS S3**: 
    - Create a bucket and provide IAM credentials for image storage.

## 4. Running the Platform
- [ ] **Terminal 1 (Python)**:
    ```bash
    cd python-ml
    pip install -r requirements.txt
    python main.py
    ```
- [ ] **Terminal 2 (Node.js)**:
    ```bash
    cd server
    npm install
    node index.js
    ```
- [ ] **Terminal 3 (Worker)**:
    ```bash
    cd server
    node workers/satelliteWorker.js
    ```

## 5. Verification
- [ ] Register a user via `POST /api/auth/register`.
- [ ] Upload a plantation and watch the Bull queue process it via the Python ML service.
- [ ] Approve the plantation as Admin to trigger the on-chain minting.
