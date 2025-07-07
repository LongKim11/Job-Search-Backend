import City from '../models/city.model';
import { v4 as uuidv4 } from 'uuid';

const cityService = {
  getAllCities: async (options: {
    isActive?: boolean;
    page?: number;
    limit?: number;
    includeDistricts?: boolean;
  }) => {
    const query: any = {};
    if (options.isActive !== undefined) {
      query.isActive = options.isActive;
    }

    const projection: Record<string, number> = options.includeDistricts === false ? { districts: 0 } : {};

    if (options.page !== undefined && options.limit !== undefined) {
      const skip = (options.page - 1) * options.limit;
      const total = await City.countDocuments(query);
      const data = await City.find(query, projection as any).skip(skip).limit(options.limit);
      return { total, data, page: options.page, limit: options.limit };
    }

    const data = await City.find(query, projection as any);
    return { total: data.length, data };
  },

  getDistrictsByCity: async (cityId: string, isActive?: boolean) => {
    const city = await City.findById(cityId);
    if (!city) throw new Error('City not found');

    let districts = city.districts;
    if (isActive !== undefined) {
      districts = districts.filter((d) => d.isActive === isActive);
    }

    return districts;
  },


  createCity: async (data: { name: string }) => {
    const city = new City({ name: data.name });
    return await city.save();
  },

  bulkCreateCities: async (
    data: { name: string; districts?: { name: string }[] }[]
  ) => {
    const payload = data.map((city) => ({
      _id: uuidv4(),
      name: city.name,
      isActive: true,
      districts: (city.districts || []).map((d) => ({
        id: uuidv4(),
        name: d.name,
        isActive: true,
      })),
    }));

    return await City.insertMany(payload);
  },

  updateCity: async (cityId: string, data: { name?: string; isActive?: boolean }) => {
    const city = await City.findByIdAndUpdate(cityId, data, { new: true });
    if (!city) throw new Error('City not found');
    return city;
  },

  toggleCityActive: async (cityId: string) => {
    const city = await City.findById(cityId);
    if (!city) throw new Error('City not found');
    city.isActive = !city.isActive;
    return await city.save();
  },

  addDistrict: async (cityId: string, name: string) => {
    const city = await City.findById(cityId);
    if (!city) throw new Error('City not found');

    const district = {
      id: uuidv4(),
      name,
      isActive: true,
    };

    city.districts.push(district);
    await city.save();
    return district;
  },

  updateDistrict: async (
    cityId: string,
    districtId: string,
    data: { name?: string; isActive?: boolean }
  ) => {
    const city = await City.findById(cityId);
    if (!city) throw new Error('City not found');

    const district = city.districts.find((d) => d.id === districtId);
    if (!district) throw new Error('District not found');

    if (data.name) district.name = data.name;
    if (data.isActive !== undefined) district.isActive = data.isActive;

    await city.save();
    return district;
  },

  toggleDistrictActive: async (cityId: string, districtId: string) => {
    const city = await City.findById(cityId);
    if (!city) throw new Error('City not found');

    const district = city.districts.find((d) => d.id === districtId);
    if (!district) throw new Error('District not found');

    district.isActive = !district.isActive;
    await city.save();
    return district;
  },
};

export default cityService;