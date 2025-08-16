const chai = require("chai")
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")
const sinon = require("sinon")
const MedicalRecord = require("../models/MedicalRecord")
const {
  getMedicalRecords,
  addMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} = require("../controllers/medicalRecordController")
const { expect } = chai

chai.use(chaiHttp)

describe("Medical Record Controller Tests", () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe("AddMedicalRecord Function Test", () => {
    it("should create a new medical record successfully", async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          patientName: "John Doe",
          doctor: "Dr. Smith",
          dateOfBirth: "1990-01-01",
          diagnose: "Hypertension",
          treatment: "Medication",
        },
      }

      const createdRecord = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id }
      const createStub = sandbox.stub(MedicalRecord, "create").resolves(createdRecord)

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await addMedicalRecord(req, res)

      expect(createStub.calledOnce).to.be.true
      expect(res.status.calledWith(201)).to.be.true
      expect(res.json.calledWith(createdRecord)).to.be.true
    })

    it("should return 500 if an error occurs", async () => {
      const createStub = sandbox.stub(MedicalRecord, "create").rejects(new Error("DB Error"))

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          patientName: "John Doe",
          doctor: "Dr. Smith",
          dateOfBirth: "1990-01-01",
          diagnose: "Hypertension",
          treatment: "Medication",
        },
      }

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await addMedicalRecord(req, res)

      expect(res.status.calledWith(500)).to.be.true
      expect(res.json.calledWithMatch({ message: "Failed to create medical record." })).to.be.true
    })
  })

  describe("UpdateMedicalRecord Function Test", () => {
    it("should update medical record successfully", async () => {
      const recordId = new mongoose.Types.ObjectId()
      const userId = new mongoose.Types.ObjectId()
      const existingRecord = {
        _id: recordId,
        userId: userId,
        patientName: "John Doe",
        doctor: "Dr. Smith",
        diagnose: "Old Diagnosis",
        treatment: "Old Treatment",
        save: sandbox.stub().callsFake(function () {
          this.diagnose = "New Diagnosis"
          this.treatment = "New Treatment"
          return Promise.resolve(this)
        }),
      }

      const findByIdStub = sandbox.stub(MedicalRecord, "findById").resolves(existingRecord)

      const req = {
        user: { id: userId },
        params: { id: recordId },
        body: { diagnose: "New Diagnosis", treatment: "New Treatment" },
      }
      const res = {
        json: sandbox.spy(),
        status: sandbox.stub().returnsThis(),
      }

      await updateMedicalRecord(req, res)

      expect(existingRecord.save.calledOnce).to.be.true
      expect(res.status.called).to.be.false
      expect(res.json.calledOnce).to.be.true
    })

    it("should return 404 if medical record is not found", async () => {
      const findByIdStub = sandbox.stub(MedicalRecord, "findById").resolves(null)

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId() },
        body: {},
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await updateMedicalRecord(req, res)

      expect(res.status.calledWith(404)).to.be.true
      expect(res.json.calledWith({ message: "Medical record not found" })).to.be.true
    })

    it("should return 500 on error", async () => {
      const findByIdStub = sandbox.stub(MedicalRecord, "findById").rejects(new Error("DB Error"))

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId() },
        body: {},
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await updateMedicalRecord(req, res)

      expect(res.status.calledWith(500)).to.be.true
      expect(res.json.called).to.be.true
    })
  })

  describe("GetMedicalRecords Function Test", () => {
    it("should return medical records for the given user", async () => {
      const userId = new mongoose.Types.ObjectId()
      const records = [
        { _id: new mongoose.Types.ObjectId(), patientName: "John Doe", userId },
        { _id: new mongoose.Types.ObjectId(), patientName: "Jane Smith", userId },
      ]

      const sortStub = sandbox.stub().resolves(records)
      const findStub = sandbox.stub(MedicalRecord, "find").returns({ sort: sortStub })

      const req = { user: { id: userId } }
      const res = {
        json: sandbox.spy(),
        status: sandbox.stub().returnsThis(),
      }

      await getMedicalRecords(req, res)

      expect(findStub.calledOnce).to.be.true
      expect(sortStub.calledOnceWith({ createdAt: -1 })).to.be.true
      expect(res.json.calledWith(records)).to.be.true
      expect(res.status.called).to.be.false
    })

    it("should return 500 on error", async () => {
      const findStub = sandbox.stub(MedicalRecord, "find").rejects(new Error("DB Error"))

      const req = { user: { id: new mongoose.Types.ObjectId() } }
      const res = {
        json: sandbox.spy(),
        status: sandbox.stub().returnsThis(),
      }

      await getMedicalRecords(req, res)

      expect(res.status.calledWith(500)).to.be.true
      expect(res.json.calledWithMatch({ message: "Failed to fetch medical records." })).to.be.true
    })
  })

  describe("DeleteMedicalRecord Function Test", () => {
    it("should delete a medical record successfully", async () => {
      const recordId = new mongoose.Types.ObjectId()
      const userId = new mongoose.Types.ObjectId()
      const record = {
        _id: recordId,
        userId: userId,
      }

      const findByIdStub = sandbox.stub(MedicalRecord, "findById").resolves(record)
      const deleteOneStub = sandbox.stub(MedicalRecord, "deleteOne").resolves()

      const req = {
        user: { id: userId },
        params: { id: recordId.toString() },
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await deleteMedicalRecord(req, res)

      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true
      expect(deleteOneStub.calledOnceWith({ _id: req.params.id })).to.be.true
      expect(res.json.calledWith({ message: "Medical record deleted" })).to.be.true
    })

    it("should return 404 if medical record is not found", async () => {
      const findByIdStub = sandbox.stub(MedicalRecord, "findById").resolves(null)

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId().toString() },
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await deleteMedicalRecord(req, res)

      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true
      expect(res.status.calledWith(404)).to.be.true
      expect(res.json.calledWith({ message: "Medical record not found" })).to.be.true
    })

    it("should return 500 if an error occurs", async () => {
      const findByIdStub = sandbox.stub(MedicalRecord, "findById").rejects(new Error("DB Error"))

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId().toString() },
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await deleteMedicalRecord(req, res)

      expect(res.status.calledWith(500)).to.be.true
      expect(res.json.calledWithMatch({ message: "Failed to delete medical record." })).to.be.true
    })
  })
})
