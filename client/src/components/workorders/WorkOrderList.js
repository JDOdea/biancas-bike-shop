import { useEffect, useState } from "react";
import { Table } from "reactstrap";
import { getIncompleteWorkOrders } from "../../managers/workOrderManager";
import { Link } from "react-router-dom";

export default function WorkOrderList({ loggedInUser }) {
    const [workOrders, setWorkOrders] = useState([]);

    useEffect(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
    }, []);

    return (
        <>
          <h2>Open Work Orders</h2>
          <Link to="/workorders/create">New Work Order</Link>
          <Table>
            <thead>
              <tr>
                <th>Owner</th>
                <th>Brand</th>
                <th>Color</th>
                <th>Description</th>
                <th>DateSubmitted</th>
                <th>Mechanic</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((wo) => (
                <tr key={wo.id}>
                  <th scope="row">{wo.bike.owner.name}</th>
                  <td>{wo.bike.brand}</td>
                  <td>{wo.bike.color}</td>
                  <td>{wo.description}</td>
                  <td>{new Date(wo.dateInitiated).toLocaleDateString()}</td>
                  <td>
                    {wo.userProfile
                      ? `${wo.userProfile.firstName} ${wo.userProfile.lastName}`
                      : "unassigned"}
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      );
}