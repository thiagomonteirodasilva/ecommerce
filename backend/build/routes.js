"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
// interface creatingProduct {
//     name: string;
//     description: string;
//     price: string | number | Prisma.Decimal | DecimalJsLike
//     published_at: Date | string
//     userId: number;
// }
exports.routes = express_1.default.Router();
const prisma = new client_1.PrismaClient();
console.log('this is routes');
exports.routes.post('/create-product', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let productInput;
    productInput = {
        name: String(req.query.name),
        description: String(req.query.description),
        price: Number(req.query.price),
        published_at: new Date(),
        user: {
            connect: {
                id: Number(req.query.user)
            }
        }
    };
    yield prisma.product.create({
        data: productInput
    });
    return res.status(200).json('Product created successfully!');
}));
