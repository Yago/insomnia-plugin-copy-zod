const fs = require('fs');
const { jsonToZod } = require('json-to-zod');

module.exports.requestActions = [
  {
    label: 'Copy Zod Schema',
    action: async (context, data) => {
      const { app: { alert }, network: { sendRequest }, store: { setItem } } = context;
      const { request } = data;
      const response = await context.network.sendRequest(request);
      if (!response.bodyPath) {
        alert('', 'there was an error in the request check the request!');
        return;
      }

      try {
        const body = JSON.parse(fs.readFileSync(response.bodyPath, { encoding:'utf8' }));
        
        navigator.clipboard.writeText(jsonToZod(body, 'ResponseSchema', true) + "\n\nexport type Response = z.infer<typeof ResponseSchema>;").then(() => {
          alert('Success!', 'Copied schema, check your clipboard!');
        }, () => {
          alert('', 'There was a problem copying the schema, please try again');
        });
      } catch (e) {
        alert('', 'There was a problem copying the schema, please try again');
        return;
      }
    },
    icon: "fa-clone",
  },
];