import User from "../Models/user.model.js";
import Event from "../Models/event.model.js";
import Team from "../Models/team.model.js";
import AsyncErrorHandler from "../ErrorHandlers/async_error_handler.js";
import { activationnotice } from '../helper/mailhandler.js';
// controller to get all the users who have paid the fees
const getallFeePaid = AsyncErrorHandler(async (req, res, next) => {
    const users = await User.find({ isFeePaid: true }).lean();

    if (!users) {
        return next(new Error("Cannot find user"));
    }
    // althought the password is hashed, but still doing this
    users.map((user) => {
        delete user.password;
    });
    return res.status(200).json({
        users,
        success: true,
    });
});

// controller to get all the users who have not paid the fees
const getallFeeNotPaid = AsyncErrorHandler(async (req, res, next) => {
    const users = await User.find({ isFeePaid: false }).lean();
    if (!users) {
        return next(new Error("Cannot find user"));
    }
    // althought the password is hashed, but still doing this
    users.map((user) => {
        delete user.password;
    });
    return res.status(200).json({
        users,
        success: true,
    });
});

// controller to get all the participating teams, for an event -> eventId
const getallTeamEvents = AsyncErrorHandler(async (req, res, next) => {
    const { eventId } = req.params;
    if (typeof eventId !== "string" || eventId.trim() === "") {
        return next(new Error("Invalid eventId format"));
    }
    if (!eventId) {
        return next(Error("eventId not passed as params"));
    }
    // populating the event with all the references
    const event = await Event.findOne({ eventId }).populate({
        path: "participatingTeams",
        ref: "Team",
        populate: [
            {
                path: "acceptedMembers",
                ref: "User",
            },
        ],
    });
    if (!event) {
        const error = new Error("No event exists with the given eventId");
        return next(error);
    }
    return res.status(200).json({
        event,
        success: true,
    });
});

// Controllers related to excel file
// 1.
// rreturn all the teams and their Members (accepted and pending) for all the events
const downloadAllEventTeamMembers = AsyncErrorHandler(
    async (req, res, next) => {
        const allEvents = await Event.find({}).populate([
            {
                path: "participatingTeams",
                ref: "Team",
                populate: [
                    [
                        {
                            path: "acceptedMembers",
                            ref: "User",
                        },
                    ],
                    [
                        {
                            path: "pendingMembers",
                            ref: "User",
                        },
                    ],
                ],
            },
        ]);
        if (!allEvents) {
            return next(new Error("Cannot find events at the moment"));
        }
        // no teams present
        if (allEvents.length == 0) {
            return res.status(200).json({
                message: "No team registered till now",
                success: true,
            });
        }
        let allEventFormatted = {};
        allEvents.map((event, parentIndex) => {
            let allEventTeamsFormatted = {};
            // formatting the data in way to help the excel file create
            event.participatingTeams.map((team, index) => {
                let singleTeamFormatted = {};

                //pushing all the accepted members
                team.acceptedMembers.map((member, index2) => {
                    singleTeamFormatted = {
                        ...singleTeamFormatted,
                        [`Name ${index2 + 1}`]: member.name,
                        [`Email ${index2 + 1}`]: member.email,
                        [`Phone ${index2 + 1}`]: member.phone,
                        [`College ${index2 + 1}`]: member.college,
                    };
                });

                // pushing all the pending members
                team.pendingMembers.map((member, index2) => {
                    singleTeamFormatted = {
                        ...singleTeamFormatted,
                        [`Pending Name ${index2 + 1}`]: member.name,
                        [`Pending Email ${index2 + 1}`]: member.email,
                        [`Pending Phone ${index2 + 1}`]: member.phone,
                        [`Pending College ${index2 + 1}`]: member.college,
                    };
                });
                // pushing to the parent object
                allEventTeamsFormatted = {
                    ...allEventTeamsFormatted,

                    [`Team ${index + 1}`]: {
                        TeamName: team.name,
                        TeamSize: team.size,
                        ...singleTeamFormatted,
                    },
                };
            });
            allEventFormatted = {
                ...allEventFormatted,
                [`${event.eventName}`]: {
                    ...allEventTeamsFormatted,
                },
            };
        });

        return res.status(200).json({
            data: allEventFormatted,
            success: true,
        });
    }
);

//2.
// return all the teams and their Members (accepted and pending) for a particular event
const downloadAllEventTeamMembersEventId = AsyncErrorHandler(
    async (req, res, next) => {
        const { eventId } = req.params;
        // console.log(eventId);
        if (!eventId) {
            return next(new Error("TeamId not present")); // skipping directly to error handler
        }
        console.log({ eventId });
        const allEvents = await Event.find({ eventId }).populate([
            {
                path: "participatingTeams",
                ref: "Team",
                populate: [
                    [
                        {
                            path: "acceptedMembers",
                            ref: "User",
                        },
                    ],
                    [
                        {
                            path: "pendingMembers",
                            ref: "User",
                        },
                    ],
                ],
            },
        ]);
        if (!allEvents) {
            return next(new Error("Cannot find events at the moment"));
        }
        // no teams present
        if (allEvents.length == 0) {
            return res.status(200).json({
                message: "No team registered till now",
                success: true,
            });
        }
        let allEventFormatted = {};
        allEvents.map((event, parentIndex) => {
            let allEventTeamsFormatted = {};
            // formatting the data in way to help the excel file create
            event.participatingTeams.map((team, index) => {
                let singleTeamFormatted = {};

                //pushing all the accepted members
                team.acceptedMembers.map((member, index2) => {
                    singleTeamFormatted = {
                        ...singleTeamFormatted,
                        [`Name ${index2 + 1}`]: member.name,
                        [`Email ${index2 + 1}`]: member.email,
                        [`Phone ${index2 + 1}`]: member.phone,
                        [`College ${index2 + 1}`]: member.college,
                    };
                });

                // pushing all the pending members
                team.pendingMembers.map((member, index2) => {
                    singleTeamFormatted = {
                        ...singleTeamFormatted,
                        [`Pending Name ${index2 + 1}`]: member.name,
                        [`Pending Email ${index2 + 1}`]: member.email,
                        [`Pending Phone ${index2 + 1}`]: member.phone,
                        [`Pending College ${index2 + 1}`]: member.college,
                    };
                });
                // pushing to the parent object
                allEventTeamsFormatted = {
                    ...allEventTeamsFormatted,

                    [`Team ${index + 1}`]: {
                        TeamName: team.name,
                        TeamSize: team.size,
                        ...singleTeamFormatted,
                    },
                };
            });
            allEventFormatted = {
                ...allEventFormatted,
                [`${event.eventName}`]: {
                    ...allEventTeamsFormatted,
                },
            };
        });

        return res.status(200).json({
            data: allEventFormatted,
            success: true,
        });
    }
);

//3.
// return all the teams and their accepted members for all the events
const downloadAcceptedTeamMembers = AsyncErrorHandler(
    async (req, res, next) => {
        const allEvents = await Event.find({}).populate([
            {
                path: "participatingTeams",
                ref: "Team",
                populate: [
                    {
                        path: "acceptedMembers",
                        ref: "User",
                    },
                ],
            },
        ]);
        if (!allEvents) {
            return next(new Error("Cannot find events at the moment"));
        }
        // no teams present
        if (allEvents.length == 0) {
            return res.status(200).json({
                message: "No team registered till now",
                success: true,
            });
        }
        let allEventFormatted = {};
        allEvents.map((event, parentIndex) => {
            let allEventTeamsFormatted = {};
            // formatting the data in way to help the excel file create
            event.participatingTeams.map((team, index) => {
                let singleTeamFormatted = {};

                //pushing all the accepted members
                team.acceptedMembers.map((member, index2) => {
                    singleTeamFormatted = {
                        ...singleTeamFormatted,
                        [`Name ${index2 + 1}`]: member.name,
                        [`Email ${index2 + 1}`]: member.email,
                        [`Phone ${index2 + 1}`]: member.phone,
                        [`College ${index2 + 1}`]: member.college,
                    };
                });

                // pushing to the parent object
                allEventTeamsFormatted = {
                    ...allEventTeamsFormatted,

                    [`Team ${index + 1}`]: {
                        TeamName: team.name,
                        TeamSize: team.size,
                        ...singleTeamFormatted,
                    },
                };
            });
            allEventFormatted = {
                ...allEventFormatted,
                [`${event.eventName}`]: {
                    ...allEventTeamsFormatted,
                },
            };
        });

        return res.status(200).json({
            data: allEventFormatted,
            success: true,
        });
    }
);

// 4.
// return all the team and their accepted members for a particular event
const downloadAcceptedTeamMembersEventId = AsyncErrorHandler(
    async (req, res, next) => {
        console.log("downloadAllEventTeamMembersEventId");
        const { eventId } = req.params;
        if (!eventId) {
            return next(new Error("TeamId not present")); // skipping directly to error handler
        }
        const allEvents = await Event.find({ eventId }).populate([
            {
                path: "participatingTeams",
                ref: "Team",
                populate: [
                    {
                        path: "acceptedMembers",
                        ref: "User",
                    },
                ],
            },
        ]);
        if (!allEvents) {
            return next(new Error("Cannot find events at the moment"));
        }
        // no teams present
        if (allEvents.length == 0) {
            return res.status(200).json({
                message: "No team registered till now",
                success: true,
            });
        }
        let allEventFormatted = {};
        allEvents.map((event, parentIndex) => {
            let allEventTeamsFormatted = {};
            // formatting the data in way to help the excel file create
            event.participatingTeams.map((team, index) => {
                let singleTeamFormatted = {};

                //pushing all the accepted members
                team.acceptedMembers.map((member, index2) => {
                    singleTeamFormatted = {
                        ...singleTeamFormatted,
                        [`Name ${index2 + 1}`]: member.name,
                        [`Email ${index2 + 1}`]: member.email,
                        [`Phone ${index2 + 1}`]: member.phone,
                        [`College ${index2 + 1}`]: member.college,
                    };
                });

                // pushing to the parent object
                allEventTeamsFormatted = {
                    ...allEventTeamsFormatted,

                    [`Team ${index + 1}`]: {
                        TeamName: team.name,
                        TeamSize: team.size,
                        ...singleTeamFormatted,
                    },
                };
            });
            allEventFormatted = {
                ...allEventFormatted,
                [`${event.eventName}`]: {
                    ...allEventTeamsFormatted,
                },
            };
        });

        return res.status(200).json({
            data: allEventFormatted,
            success: true,
        });
    }
);

const makedepartmentcoordinator = async (req, res, next) => {
    const { email, department } = req.body;

    if (!email) {
        return next(new Error('Email not found'));
    }
    if (!department) {
        return next(new Error('Department not found'));
    }
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(new Error('User not found'));
        }
        if (user.role === 'dc') {
            return next(new Error('User is already a departmental coordinator'));
        }
        user.department = department;
        user.role = 'dc';
        await user.save();
        return res.status(200).json({ message: 'User role shifted to DC successfully', success: 'true' });
    } catch (err) {
        console.log(err);
        next(err);
    }
};


const getalldepartmentcoordinators=async(req,res,next)=>{
    try{
        const user = await User.find({role:'dc'});
        if(user.length==0){
            res.status(400).json({message:'There are no departmental coordinators',success:'false'});
            return ;
        }
        res.status(200).json({data:user,success:'true'});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

const getdepartmentcoordinatorsByDep = async (req,res,next) => {
    const { department } = req.body;
    if (!department) {
        return next(new Error('department is required'));
    }
    try {
        const dcs = await User.find({ role:'dc',department });
        if (dcs.length === 0) {
            return res.status(404).json({ message: 'No departmental coordinators found for this department', success: false });
        }
        res.status(200).json({data:dcs,success:true});
    } catch (err) {
        console.error(err);
        next(err);
    }
}

const deletedepartmentcoordinators=async(req,res,next)=>{
    const {email} = req.body;
    if(!email){
        return next(new Error('Invalid email'));
    }
    try{
        const user = await User.findOne({email});
        if (!user) {
            return next(new Error('User not found'));
        }
        if(user.role!="dc"){
            return next(new Error('User is not a departmental coordinator'));
        }
        user.role='user';
        user.department=null;
        await user.save();
        res.status(200).json({data:'dc role removed',success:'true'});
    }
    catch(err){
        console.log(err);
        next(err);
    }
}


const verifypayment=async(req,res,next)=>{
    const {email,paymentstatus,userid} = req.body;
    if(!email){
        return next(new Error('Invalid email'));
    }
    if(paymentstatus==null){
        return next(new Error('status cannot be empty'));
    }
    if(!userid){
        return next(new Error('userid cannot be empty'));
    }
    try{
        const user = await User.findById(userid);
        if(!user){
            return next(new Error('user should exist'));
        }
        const verifyuser = await User.findOne({email});
        if(!verifyuser){
            return next(new Error('verifyuser should exist'));
        }
        if(user.role!="fs"){
            return next(new Error('only festival secretary can verify the payment status'));
        }
        if(paymentstatus){
            verifyuser.isFeePaid=true;
            await verifyuser.save();
            const mail = await activationnotice(email, 'Your Account Has Been Activated by Payment Verification');
            console.log("mail",mail);
            if (mail) {
                return res.status(200).json({ message: "User is verified", success: true });
            }
            return res.status(200).json({ message: "User is verified but unable to send the mail", success: true });
        }
    }
    catch(err){
        next(err);
    }
}

export {
    getallFeePaid,
    getallFeeNotPaid,
    getallTeamEvents,
    downloadAllEventTeamMembers,
    downloadAllEventTeamMembersEventId,
    downloadAcceptedTeamMembers,
    downloadAcceptedTeamMembersEventId,
    makedepartmentcoordinator,
    getalldepartmentcoordinators,
    getdepartmentcoordinatorsByDep,
    deletedepartmentcoordinators,
    verifypayment
};