import { Router } from "express";
import { testGemini } from "../services/gemini.service.js";

const router = Router();

router.get("/test", async (req, res) => {
  try {
    const response = await testGemini();
    res.json({
      success: true,
      response,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;