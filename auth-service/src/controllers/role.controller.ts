import { Request, Response } from 'express';
import roleService from '../services/role.service';
import { successResponse, errorResponse } from '../utils/apiResponse';

const roleController = {
  getAllRoles: async (req: Request, res: Response) => {
    try {
      const { isAdmin } = req.query;
      let whereClause = undefined;
      if (isAdmin === 'true') {
        whereClause = { isRoleAdmin: true };
      } else if (isAdmin === 'false') {
        whereClause = { isRoleAdmin: false };
      }
      const roles = await roleService.getAllRoles(whereClause);
      res
        .status(200)
        .json(successResponse('Roles fetched successfully', roles));
    } catch (err: any) {
      res.status(500).json(errorResponse(err.message));
    }
  },

  getRoleById: async (req: Request, res: Response) => {
    try {
      const role = await roleService.getRoleById(req.params.id);
      res.status(200).json(successResponse('Role fetched successfully', role));
    } catch (err: any) {
      res.status(404).json(errorResponse(err.message));
    }
  },

  createRole: async (req: Request, res: Response) => {
    try {
      const { role_name, role_description, isRoleAdmin = false } = req.body;
      const newRole = await roleService.createRole({
        role_name,
        role_description,
        isRoleAdmin,
      });
      res
        .status(201)
        .json(successResponse('Role created successfully', newRole));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  updateRole: async (req: Request, res: Response) => {
    try {
      const { role_name, role_description, isRoleAdmin = false } = req.body;
      const updatedRole = await roleService.updateRole(req.params.id, {
        role_name,
        role_description,
        isRoleAdmin,
      });
      res
        .status(200)
        .json(successResponse('Role updated successfully', updatedRole));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },

  deleteRole: async (req: Request, res: Response) => {
    try {
      await roleService.deleteRole(req.params.id);
      res.status(200).json(successResponse('Role deleted successfully', null));
    } catch (err: any) {
      res.status(400).json(errorResponse(err.message));
    }
  },
};

export default roleController;
