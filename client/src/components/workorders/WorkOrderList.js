import { useEffect, useState } from "react";
import { Button, Input, Table } from "reactstrap";
import { completedWorkOrder, deletedWorkOrder, getIncompleteWorkOrders, updateWorkOrder } from "../../managers/workOrderManager";
import { Link } from "react-router-dom";
import { getUserProfiles } from "../../managers/userProfileManager";

export default function WorkOrderList({ loggedInUser }) {
    const [workOrders, setWorkOrders] = useState([]);
    const [mechanics, setMechanics] = useState([]);

    const assignMechanic = (workOrder, mechanicId) => {
      const clone = structuredClone(workOrder);
      clone.userProfileId = mechanicId || null;
      updateWorkOrder(clone).then(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
      });
    };

    const completeWorkOrder = (workOrderId) => {
      completedWorkOrder(workOrderId).then(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
      });
    };

    const deleteWorkOrder = (workOrderId) => {
      deletedWorkOrder(workOrderId).then(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
      })
    }

    useEffect(() => {
        getIncompleteWorkOrders().then(setWorkOrders);
        getUserProfiles().then(setMechanics);
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
                  <td>
                    <Input
                      type ="select"
                      onChange={(e) => {
                        assignMechanic(wo, parseInt(e.target.value));
                      }}
                      value={wo.userProfileId || 0}
                    >
                      <option value="0">Choose Mechanic</option>
                      {mechanics.map((m) => (
                        <option
                          key={m.id}
                          value={m.id}
                        >{`${m.firstName} ${m.lastName}`}</option>
                      ))}
                    </Input>
                  </td>
                  <td>
                    {wo.userProfile && (
                      <Button
                      onClick={() => completeWorkOrder(wo.id)}
                      color="success"
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </td>
                  <td>
                    {wo.userProfile && (
                      <Button
                      onClick={() => deleteWorkOrder(wo.id)}
                      color="danger"
                      >
                        Delete Work Order
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      );
}