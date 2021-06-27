const router = require("express").Router(),
  MyApps = require("../db/models/myApps");

router.get("/", async (req, res) => {
  try {
    let by = "id",
      start = 1,
      max = 50;

    const search = {};
    search[by] = { $gt: start - 1 };

    const pagination = await MyApps.find(search).select("-_id -__v").limit(max);

    //sorts pagination in ascending order
    pagination.sort((a, b) => {
      return a.id - b.id;
    });

    res.status(200).json(pagination);
  } catch (err) {
    console.log(err.message);
  }
});

router.get("/:range", async (req, res) => {
  try {
    const data = JSON.parse(req.params.range);
    let by = data.by,
      start =
        (data.by === "name" ? Number(data.start.slice(-3)) : data.start) || 1,
      end = data.by === "name" ? Number(data.end.slice(-3)) : data.end,
      max = data.max || 50,
      order = data.order || "asc";

    console.log(Math.min(end, max));
    const search = {};
    search[by] = { $gt: start - 1 };

    const pagination = await MyApps.find(search)
      .select("-_id -__v")
      .limit(end === undefined ? max : Math.min(end, max));

    //sorts pagination in ascending order
    pagination.sort((a, b) => {
      if (order === "asc") {
        return a.id - b.id;
      } else if (order === "desc") {
        return b.id - a.id;
      }
    });

    res.status(200).json(pagination);
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;
