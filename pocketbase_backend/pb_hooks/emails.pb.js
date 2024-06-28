/// <reference path="..\pb_data\types.d.ts" />

/**
  This route is used to send an email to the user letting them know that their diagnosis is ready
 */

routerAdd("POST", "/api/emails/diagnosticready", async (c) => {
  const data = $apis.requestInfo(c).data;
  console.log(data.userId);
  console.log(data.diagnosisId);
  const userRecord = await $app.dao().findRecordById("users", data.userId);
  const userEmail = userRecord.get("email");
  console.log(userEmail);
  const diagnosisRecord = await $app
    .dao()
    .findRecordById("diagnosis", data.diagnosisId);
  const chatResponse = data.chatResponse;

  if (diagnosisRecord) {
    diagnosisRecord.set("report", chatResponse);
    await $app.dao().saveRecord(diagnosisRecord);
  }
  try {
    try {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName,
        },
        to: [{ address: `${userEmail}` }],
        subject: `Synesis Business - Diagnostic Ready!`,
        html: `<!DOCTYPE html>
<html>
  <head>
    <title>Synesis Business - Diagnostic Ready</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      font-size: 16px;
    "
  >
    Your diagnosis has been generated and is ready, you can check it on our website, 
    <a href="https://synesisbusiness.com/diagnosis" style="text-decoration: none; color: #2d90b0">click here</a>.
  </body>
</html>
`,
      });

      await $app.newMailClient().send(message);
      console.log(`Email enviado para ${userEmail}`);
    } catch (error) {
      console.error("Error sending email:", error);
      return c.json(500, { error: "Failed to send email notification." });
    }

    return c.json(200, { content: "Email sent." });
  } catch (e) {
    console.error("General error in processing the request:", e);
    return c.json(500, { error: "Internal server error during processing." });
  }
});

/**
  This route is used to send an email to the user letting them know that their growth plan is ready
 */

routerAdd("POST", "/api/emails/growth_plan_ready", async (c) => {
  const data = $apis.requestInfo(c).data;
  console.log("data: ", JSON.stringify(data));
  console.log("userId: ", data.userId);
  const growthPlanId = data.diagnosisId;
  console.log("growthPlanId: ", growthPlanId);
  const userRecord = await $app.dao().findRecordById("users", data.userId);
  const userEmail = userRecord.get("email");
  console.log("userEmail: ", userEmail);
  const growthPlanRecord = await $app
    .dao()
    .findRecordById("growth_plan", growthPlanId);
  const chatResponse = data.chatResponse;

  if (growthPlanRecord) {
    growthPlanRecord.set("report", chatResponse);
    await $app.dao().saveRecord(growthPlanRecord);
  }
  try {
    try {
      const message = new MailerMessage({
        from: {
          address: $app.settings().meta.senderAddress,
          name: $app.settings().meta.senderName,
        },
        to: [{ address: `${userEmail}` }],
        subject: `Synesis Business - Growth Plan Ready!`,
        html: `<!DOCTYPE html>
  <html>
    <head>
      <title>Synesis Business - Growth Plan Ready</title>
    </head>
    <body
      style="
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 20px;
        font-size: 16px;
      "
    >
      Your growth plan has been generated and is ready, you can check it on our website, 
      <a href="https://synesisbusiness.com/growth_plan" style="text-decoration: none; color: #2d90b0">click here</a>.
    </body>
  </html>
  `,
      });

      await $app.newMailClient().send(message);
      console.log(`Email sent to ${userEmail}`);
    } catch (error) {
      console.error("Error sending email:", error);
      return c.json(500, { error: "Failed to send email notification." });
    }

    return c.json(200, { content: "Email sent." });
  } catch (e) {
    console.error("General error in processing the request:", e);
    return c.json(500, { error: "Internal server error during processing." });
  }
});
