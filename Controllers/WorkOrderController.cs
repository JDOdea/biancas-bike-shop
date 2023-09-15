using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using BiancasBikes.Data;
using BiancasBikes.Models;

namespace BiancasBikes.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkOrderController : ControllerBase
{
    private BiancasBikesDbContext _dbContext;

    public WorkOrderController(BiancasBikesDbContext context)
    {
        _dbContext = context;
    }

    [HttpGet("incomplete")]
    [Authorize]
    public IActionResult GetIncompleteWorkOrders()
    {
        return Ok(_dbContext.WorkOrders
            .Include(wo => wo.Bike)
            .ThenInclude(b => b.Owner)
            .Include(wo => wo.Bike)
            .ThenInclude(b => b.BikeType)
            .Include(wo => wo.UserProfile)
            .Where(wo => wo.DateCompleted == null)
            .OrderBy(wo => wo.DateInitiated)
            .ThenByDescending(wo => wo.UserProfileId == null).ToList());
    }

    [HttpPost]
    [Authorize]
    public IActionResult CreateWorkOrder(WorkOrder workOrder)
    {
        workOrder.DateInitiated = DateTime.Now;
        _dbContext.WorkOrders.Add(workOrder);
        _dbContext.SaveChanges();
        return Created($"/api/workorder/{workOrder.Id}", workOrder);
    }

    [HttpPut("{id}")]
    [Authorize]
    public IActionResult UpdateWorkOrder(WorkOrder workOrder, int id)
    {
        WorkOrder workOrderToUpdate = _dbContext.WorkOrders.SingleOrDefault(wo => wo.Id == id);
        if (workOrderToUpdate == null)
        {
            return NotFound();
        }
        else if (id != workOrder.Id)
        {
            return BadRequest();
        }

        workOrderToUpdate.Description = workOrder.Description;
        workOrderToUpdate.UserProfileId = workOrder.UserProfileId;
        workOrderToUpdate.BikeId = workOrder.BikeId;

        _dbContext.SaveChanges();

        return NoContent();
    }

    [HttpPut("{id}/completed")]
    [Authorize]
    public IActionResult CompleteWorkOrder(int id)
    {
        WorkOrder workOrderToComplete = _dbContext.WorkOrders.SingleOrDefault(wo => wo.Id == id);
        if (workOrderToComplete == null)
        {
            return NotFound();
        }

        workOrderToComplete.DateCompleted = DateTime.Now;

        _dbContext.SaveChanges();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize]
    public IActionResult DeleteWorkOrder(int id)
    {
        WorkOrder workOrderToDelete = _dbContext.WorkOrders.SingleOrDefault(wo => wo.Id == id);
        if (workOrderToDelete == null)
        {
            return NotFound();
        }

        _dbContext.WorkOrders.Remove(workOrderToDelete);
        _dbContext.SaveChanges();
        return NoContent();
    }
}