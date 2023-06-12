import React from "react";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
    MenuList,
    MenuItem,
    Menu,
    MenuHandler
} from "@material-tailwind/react";
import axios from "axios";
import cookie from "cookie";
import { useParams } from "react-router-dom";
export default function AddTask() {
    const { id } = useParams().id;
    const [open, setOpen] = React.useState(false);
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [dueDate, setDueDate] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [assignedTo, setAssignedTo] = React.useState("");
    const handleOpen = () => setOpen((cur) => !cur);
    const handleSubmit = async e => {
        e.preventDefault();
        const cookies = cookie.parse(document.cookie);
        axios.post('http://localhost:1337/api/tasks',
            {
                title,
                description,
                due_date: dueDate,
                status: 'in progress',
                project: id,
                assigned_to: assignedTo
            }
            , { headers: { Authorization: `Bearer ${cookies.token}` } });
    }
    return (
        <React.Fragment>
            <Button className="flex items-center gap-3" color="blue" size="sm" onClick={handleOpen}>
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Task
            </Button>
            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <Card className="mx-auto w-full max-w-[24rem]">
                    <CardHeader
                        variant="gradient"
                        color="blue"
                        className="mb-4 grid h-28 place-items-center"
                    >
                        <Typography variant="h3" color="white">
                            Add Task
                        </Typography>
                    </CardHeader>
                    <CardBody className="">
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <Input label="Title" size="lg" onChange={(e) => setTitle(e.target.value)} />
                            <Input label="Description" size="lg" onChange={(e) => setDescription(e.target.value)} />
                            <Input label="Due Date" size="lg" type="date" onChange={(e) => setDueDate(new Date(e.target.value).getTime())} />
                            {/* <Input label="Assigned To" size="lg"  onChange={(e) => setAssignedTo(e.target.value)} /> */}
                            {/*TODO: create menu list */}
                            <Menu placement="bottom-start">
                                <MenuHandler>
                                    <Button color="blue" size="lg" ripple="light">
                                        Assigned To
                                    </Button>
                                </MenuHandler>
                                <MenuList>
                                    <MenuItem>a</MenuItem>
                                    <MenuItem>b</MenuItem>
                                    <MenuItem>c</MenuItem>
                                </MenuList>
                            </Menu>
                            <Button type="submit" variant="gradient" onClick={handleOpen} fullWidth>
                                Add Task
                            </Button>
                        </form>
                    </CardBody>

                </Card>
            </Dialog>
        </React.Fragment>
    );
}