import { UserPlusIcon } from "@heroicons/react/24/solid";
import { Button, Card, CardBody, CardFooter, CardHeader, Chip, Typography, Input } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import cookie from "cookie";
import EditTask from "./editTask";




export default function TaskTable() {
    const cookies = cookie.parse(document.cookie);
    const TABLE_HEAD = ["Task", "Description", "Status", "Due Date", "Assigned To"].filter(Boolean);
    const [tasks, setTasks] = useState(null);
    const [userMap, setUserMap] = useState(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    function handleSearch(e) {
        setSearch(e.target.value);
    }
    function handleNextPage() {
        setPage(page + 1);
    }
    function handlePrevPage() {
        if (page > 1) setPage(page - 1);
    }

    useEffect(() => {
        axios.get("http://localhost:1337/api/users",
            { headers: { Authorization: `Bearer ${cookies.token}` } })
            .then((res) => {
                setUserMap(res.data.reduce((map, user) => {
                    map[user._id] = user;
                    return map;
                }, {}));
            })
            .catch(err => {
                alert(err);
            });
    }, []);
    useEffect(() => {
        axios.get(`http://localhost:1337/api/tasks?page=${page}&limit=10`,
            { headers: { Authorization: `Bearer ${cookies.token}` } })
            .then((res) => {
                setTasks(res.data);
            });
    }, [page]);
    useEffect(() => {
        axios.get(`http://localhost:1337/api/tasks/name?name=${search}&limit=10`,
            { headers: { Authorization: `Bearer ${cookies.token}` } })
            .then((res) => {
                setTasks(res.data);
            }).catch(err => {
                alert(err);
            });
    }, [search]);
    //Loading
    if (!tasks || !userMap) {
        return <div>Loading...</div>
    }
    //Loaded
    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h2" color="blue-gray">
                            Task List
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all tasks
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">

                        <div className="w-full md:w-72 ">
                            <Input label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} onChange={handleSearch} />
                        </div>

                    </div>
                </div>

            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th key={head} className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4">
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {tasks.map(({ _id, img, title, email, due_date, description, org, status, assigned_to }, index) => {
                            const isLast = index === tasks.length - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={_id}>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            {/* <Avatar src={img} alt={title} size="sm" /> */}
                                            <div className="flex flex-col">
                                                <Typography variant="medium" color="blue-gray" className="font-normal">
                                                    {title}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal opacity-70"
                                                >
                                                    {email}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex flex-col">
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {description.slice(0, 30)}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal opacity-70"
                                            >
                                                {org}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="w-max">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={(status === 'in progress') ? "In progress" : (status === "completed") ? "Completed" : "Late"}
                                                color={(status === 'in progress') ? "blue-gray" : (status === "completed") ? "green" : "red"}
                                            />
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant="small" color="blue-gray" className="font-normal">
                                            {new Date(due_date).toLocaleDateString()}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography variant='small' color="blue-gray">
                                            {assigned_to.map((user, index) => {
                                                if (index === assigned_to.length - 1) return (userMap[user].name);
                                                return (userMap[user].name + ", ");
                                            })}
                                        </Typography>
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Page {page}
                </Typography>
                <div className="flex gap-2">
                    <Button variant="outlined" color="blue-gray" size="sm" onClick={handlePrevPage}>
                        Previous
                    </Button>
                    <Button variant="outlined" color="blue-gray" size="sm" onClick={handleNextPage}>
                        Next
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}