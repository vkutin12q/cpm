import { Card, Typography, CardHeader, CardBody, Button } from "@material-tailwind/react";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import cookie from "cookie";
const TABLE_HEAD = ["Name", "Job", "Date Of Birth", ""];

const TABLE_ROWS = [
    {
        name: "John Michael",
        job: "Manager",
        date: "23/04/18",
    },
    {
        name: "Alexa Liras",
        job: "Developer",
        date: "23/04/18",
    },
    {
        name: "Laurent Perrier",
        job: "Executive",
        date: "19/09/17",
    },
    {
        name: "Michael Levi",
        job: "Developer",
        date: "24/12/08",
    },
    {
        name: "Richard Gran",
        job: "Manager",
        date: "04/10/21",
    },
];

export default function EmployeeTable() {
    const [employees, setEmployees] = useState([]);
    const cookies = cookie.parse(document.cookie);
    useEffect(() => {
        axios.get(`http://localhost:1337/api/users`, { headers: { Authorization: `Bearer ${cookies.token}` } })
            .then((res) => {
                console.log(res.data);
                setEmployees(res.data);
            })
            .catch((err) => { console.log(err); });
    }, []);
    return (
        <div className="justify-items-center overflow-auto mt-20 ml-20 mr-20">
            <Card className="overflow-scroll h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 flex items-center justify-between gap-8">
                        <div>
                            <Typography variant="h2" color="blue-gray">
                                Members
                            </Typography>
                            <Typography variant="body1" color="blue-gray" className="leading-normal">
                                Here you can manage your members.
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button variant="outlined" color="blue-gray" size="sm">
                                view all
                            </Button>
                            <Button className="flex items-center gap-3" color="blue" size="sm">
                                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add User
                            </Button>



                        </div>
                    </div>

                </CardHeader>
                <CardBody>
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr>
                                {TABLE_HEAD.map((head) => (
                                    <th key={head} className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
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
                            {employees.map(({ name, email, dob }, index) => {
                                const isLast = index === employees.length - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={name}>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {name}
                                            </Typography>
                                        </td>
                                        <td className={`${classes} bg-blue-gray-50/50`}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {email}
                                            </Typography>
                                        </td>
                                        <td className={classes}>
                                            <Typography variant="small" color="blue-gray" className="font-normal">
                                                {new Date(dob).toLocaleDateString()}
                                            </Typography>
                                        </td>
                                        <td className={`${classes} bg-blue-gray-50/50`}>
                                            <Typography as="a" href="#" variant="small" color="blue" className="font-medium">
                                                Edit
                                            </Typography>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardBody>
            </Card>
        </div>

    );
}