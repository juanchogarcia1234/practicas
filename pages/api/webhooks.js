export default async function handler(req, res) {
  if (req.method === "POST") {
    console.log(req);
  }

  res.status(200).json({ "hello": "rolw" });
}
