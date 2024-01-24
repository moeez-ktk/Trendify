const nodemailer = require("nodemailer");
jest.mock("nodemailer");

describe("contactUs", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "John",
        email: "john@example.com",
        number: "1234567890",
        message: "Hello",
      },
    };
    res = {
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should send email with correct details", async () => {
    const sendMailMock = jest.fn().mockImplementation((options, callback) => {
      expect(options.from).toBe("moeezkhattak86@gmail.com");
      expect(options.to).toBe("SWC_Admin_Acc@protonmail.com");
      expect(options.subject).toBe("Contact Us Message");
      expect(options.text).toBe(
        `Name: ${req.body.name}\nPhone Number: ${req.body.number}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`
      );
      callback(null, { response: "Email sent" });
    });

    nodemailer.createTransport.mockImplementation(() => {
      return {
        sendMail: sendMailMock,
      };
    });

    const { contactUs } = require("./adminController");

    await contactUs(req, res);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith("Email sent: Email sent");
  });

  test("should handle error when sending email fails", async () => {
    const sendMailMock = jest.fn().mockImplementation((options, callback) => {
      callback(new Error("Error sending email"), null);
    });

    nodemailer.createTransport.mockImplementation(() => {
      return {
        sendMail: sendMailMock,
      };
    });

    const { contactUs } = require("./adminController");

    await contactUs(req, res);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith("error");
  });
});

const assert = require("assert");
const sinon = require("sinon");
const { getMonthlyExpense } = require("./adminController");

// Mock Order object
const Order = require("../models/orderModel");
jest.mock("../models/orderModel");

describe("getMonthlyExpense", () => {
  it("should calculate monthly expense correctly", async () => {
    const req = {
      params: {
        month: "01",
        year: "2022",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Order.collection.aggregate method
    Order.collection.aggregate.mockResolvedValue([
      {
        _id: "someId",
        totalExpense: 100,
      },
      {
        _id: "anotherId",
        totalExpense: 200,
      },
    ]);

    // Mock the Date object to always return a specific date
    const realDate = global.Date;
    global.Date = jest.fn(() => new realDate("2022-01-15T00:00:00Z"));

    await getMonthlyExpense(req, res);

    // Restore the original Date object
    global.Date = realDate;

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(300); // 100 + 200 = 300 (totalExpense from mocked data)
  });

  it("should handle errors and return a 500 status", async () => {
    const req = {
      params: {
        month: "01",
        year: "2022",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the Order.collection.aggregate method to throw an error
    Order.collection.aggregate.mockImplementation(() => {
      throw new Error("Test error");
    });

    await getMonthlyExpense(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Error getting expense data.",
    });
  });
});
