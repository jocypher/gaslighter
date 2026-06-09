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

export const incomingAlertTemplate = `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; margin: 0;">
    <div style="background: white; padding: 25px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-top: 4px solid #f7931a;">
      <h2 style="margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 15px;">
        🚨 Bitcoin Alert Triggered
      </h2>
      
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        Hi {{name}},
      </p>
      
      <p style="color: #555; line-height: 1.6;">
        Your monitoring rule for <strong>{{app_name}}</strong> has detected an incoming Bitcoin transaction that matches your criteria.
      </p>


      <div style="background: #fff8f0; border: 1px solid #ffe0b2; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Alert Details:</p>
        <p style="margin: 0; color: #555;">
          <strong>Status:</strong> {{result}}<br>
          <strong>Rule Matched:</strong> Incoming BTC Detection<br>
          <strong>Timestamp:</strong> {{timestamp}}
        </p>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        This alert confirms that the WebSocket connection to the RPC node successfully verified the block against your rules and updated the database.
      </p>

      <p style="margin-top: 25px; color: #777; font-size: 13px; border-top: 1px solid #eee; padding-top: 15px;">
        If you did not configure this alert, please check your account settings immediately.<br/>
        <strong>{{app_name}} Monitoring Team</strong>
      </p>
    </div>
  </body>
</html>`;

export const gasPriceTemplate = `<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; margin: 0;">
    <div style="background: white; padding: 25px; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-top: 4px solid #f7931a;">
      <h2 style="margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 15px;">
        🚨 Bitcoin Alert Triggered
      </h2>
      
      <p style="color: #555; font-size: 16px; line-height: 1.5;">
        Hi {{name}},
      </p>
      
      <p style="color: #555; line-height: 1.6;">
        Your monitoring rule for <strong>{{app_name}}</strong> has detected an incoming Bitcoin transaction that matches your criteria.
      </p>


      <div style="background: #fff8f0; border: 1px solid #ffe0b2; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Alert Details:</p>
        <p style="margin: 0; color: #555;">
          <strong>Status:</strong> {{result}}<br>
          <strong>Rule Matched:</strong> Incoming BTC Detection<br>
          <strong>Timestamp:</strong> {{timestamp}}
        </p>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        This alert confirms that the WebSocket connection to the RPC node successfully verified the block against your rules and updated the database.
      </p>

      <p style="margin-top: 25px; color: #777; font-size: 13px; border-top: 1px solid #eee; padding-top: 15px;">
        If you did not configure this alert, please check your account settings immediately.<br/>
        <strong>{{app_name}} Monitoring Team</strong>
      </p>
    </div>
  </body>
</html>`;
