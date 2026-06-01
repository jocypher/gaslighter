export const changePasswordTemplate = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial; background:#f4f4f4; padding:20px;">
    <div style="background:white; padding:20px; border-radius:8px;">
      <h2>Password Reset Request</h2>

      <p>Hi {{name}},</p>

      <p>
        Your password was changed successfully.
      </p>
      <p style="margin-top:20px;">
        If you did not request this change, ignore this email.
      </p>

      <p>Thanks,<br/>{{app_name}}</p>
    </div>
  </body>
</html>
`;

export const registerTemplate = `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial; background:#f4f4f4; padding:20px;">
    <div style="background:white; padding:20px; border-radius:8px;">
      <h2>Welcome to {{app_name}}!</h2>
      <p>Hi {{name}},</p>
      <p>
        Thank you for registering. Your account has been successfully created.
      </p>
      <p style="margin-top:20px;">
        If you didn't create this account, please ignore this email.
      </p>
      <p>Thanks,<br/>{{app_name}} Team</p>
    </div>
  </body>
</html>
`;