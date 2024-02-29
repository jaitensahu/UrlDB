

const createJob = async (req, res) => {
    console.log(req.body);
    let newJob = await Jobs.create(req.body);
    newJob.save();
    res.status(201).json({
        success: true,
        message: "Job created Successfully",
    })
}