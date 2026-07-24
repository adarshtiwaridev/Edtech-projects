// update password
export const updatePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    // Validate input
    if (!userId || !newPassword) {
      return res.status(400).json({ message: "User ID and new password are required." });
    }

    // Find user by ID
    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update password
    user.password = newPassword; // Assume password is hashed in a pre-save hook
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
}