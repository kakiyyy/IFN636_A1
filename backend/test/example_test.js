const chai = require("chai")
const chaiHttp = require("chai-http")
const mongoose = require("mongoose")
const sinon = require("sinon")
const Task = require("../models/Task")
const { updateTask, getTasks, addTask, deleteTask } = require("../controllers/taskController")
const { expect } = chai

chai.use(chaiHttp)

describe("Task Controller Tests", () => {
  let sandbox

  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe("AddTask Function Test", () => {
    it("should create a new task successfully", async () => {
      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          fullName: "John Doe",
          doctor: "Dr. Smith",
          appointmentType: "Consultation",
          date: "2025-12-31",
          time: "10:00",
          notes: "Regular checkup",
        },
      }

      const createdTask = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id }

      const findOneStub = sandbox.stub(Task, "findOne").resolves(null)
      const createStub = sandbox.stub(Task, "create").resolves(createdTask)

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await addTask(req, res)

      expect(findOneStub.calledOnce).to.be.true
      expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true
      expect(res.status.calledWith(201)).to.be.true
      expect(res.json.calledWith(createdTask)).to.be.true
    })

    it("should return 500 if an error occurs", async () => {
      const findOneStub = sandbox.stub(Task, "findOne").throws(new Error("DB Error"))

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: {
          fullName: "John Doe",
          doctor: "Dr. Smith",
          appointmentType: "Consultation",
          date: "2025-12-31",
          time: "10:00",
          notes: "Regular checkup",
        },
      }

      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await addTask(req, res)

      expect(res.status.calledWith(500)).to.be.true
      expect(res.json.calledWithMatch({ message: "Failed to create appointment." })).to.be.true
    })
  })

  describe("Update Function Test", () => {
    it("should update task successfully", async () => {
      const taskId = new mongoose.Types.ObjectId()
      const userId = new mongoose.Types.ObjectId()
      const existingTask = {
        _id: taskId,
        userId: userId,
        fullName: "Old Task",
        doctor: "Dr. Old",
        appointmentType: "Old Type",
        completed: false,
        save: sandbox.stub().resolvesThis(),
      }

      const findByIdStub = sandbox.stub(Task, "findById").resolves(existingTask)

      const req = {
        user: { id: userId },
        params: { id: taskId },
        body: { fullName: "New Task", completed: true },
      }
      const res = {
        json: sandbox.spy(),
        status: sandbox.stub().returnsThis(),
      }

      await updateTask(req, res)

      expect(existingTask.fullName).to.equal("New Task")
      expect(existingTask.completed).to.equal(true)
      expect(res.status.called).to.be.false
      expect(res.json.calledOnce).to.be.true
    })

    it("should return 404 if task is not found", async () => {
      const findByIdStub = sandbox.stub(Task, "findById").resolves(null)

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId() },
        body: {},
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await updateTask(req, res)

      expect(res.status.calledWith(404)).to.be.true
      expect(res.json.calledWith({ message: "Task not found" })).to.be.true
    })

    it("should return 500 on error", async () => {
      const findByIdStub = sandbox.stub(Task, "findById").throws(new Error("DB Error"))

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId() },
        body: {},
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await updateTask(req, res)

      expect(res.status.calledWith(500)).to.be.true
      expect(res.json.called).to.be.true
    })
  })

  describe("GetTask Function Test", () => {
    it("should return tasks for the given user", async () => {
      const userId = new mongoose.Types.ObjectId()
      const tasks = [
        { _id: new mongoose.Types.ObjectId(), fullName: "Task 1", userId },
        { _id: new mongoose.Types.ObjectId(), fullName: "Task 2", userId },
      ]

      const sortStub = sandbox.stub().resolves(tasks)
      const findStub = sandbox.stub(Task, "find").returns({ sort: sortStub })

      const req = { user: { id: userId } }
      const res = {
        json: sandbox.spy(),
        status: sandbox.stub().returnsThis(),
      }

      await getTasks(req, res)

      expect(findStub.calledOnceWith({ userId })).to.be.true
      expect(sortStub.calledOnceWith({ date: 1, time: 1 })).to.be.true
      expect(res.json.calledWith(tasks)).to.be.true
      expect(res.status.called).to.be.false
    })

    it("should return 500 on error", async () => {
      const findStub = sandbox.stub(Task, "find").throws(new Error("DB Error"))

      const req = { user: { id: new mongoose.Types.ObjectId() } }
      const res = {
        json: sandbox.spy(),
        status: sandbox.stub().returnsThis(),
      }

      await getTasks(req, res)

      expect(res.status.calledWith(500)).to.be.true
      expect(res.json.calledWithMatch({ message: "Failed to fetch tasks." })).to.be.true
    })
  })

  describe("DeleteTask Function Test", () => {
    it("should delete a task successfully", async () => {
      const taskId = new mongoose.Types.ObjectId()
      const userId = new mongoose.Types.ObjectId()
      const task = {
        _id: taskId,
        userId: userId,
        remove: sandbox.stub().resolves(),
      }

      const findByIdStub = sandbox.stub(Task, "findById").resolves(task)

      const req = {
        user: { id: userId },
        params: { id: taskId.toString() },
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await deleteTask(req, res)

      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true
      expect(task.remove.calledOnce).to.be.true
      expect(res.json.calledWith({ message: "Task deleted" })).to.be.true
    })

    it("should return 404 if task is not found", async () => {
      const findByIdStub = sandbox.stub(Task, "findById").resolves(null)

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId().toString() },
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await deleteTask(req, res)

      expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true
      expect(res.status.calledWith(404)).to.be.true
      expect(res.json.calledWith({ message: "Task not found" })).to.be.true
    })

    it("should return 500 if an error occurs", async () => {
      const findByIdStub = sandbox.stub(Task, "findById").throws(new Error("DB Error"))

      const req = {
        user: { id: new mongoose.Types.ObjectId() },
        params: { id: new mongoose.Types.ObjectId().toString() },
      }
      const res = {
        status: sandbox.stub().returnsThis(),
        json: sandbox.spy(),
      }

      await deleteTask(req, res)

      expect(res.status.calledWith(500)).to.be.true
      expect(res.json.calledWithMatch({ message: "Failed to delete appointment." })).to.be.true
    })
  })
})
