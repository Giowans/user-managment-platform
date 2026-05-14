import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) { }

    private users: { id: number; email: string; password: string; role: string }[] = [];

    async register(data: any) {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = {
            id: Date.now(),
            email: data.email,
            password: hashedPassword,
            role: 'user',
        };

        this.users.push(user);

        return {
            message: 'User registered successfully',
        };
    }

    async login(data: any) {
        const user = this.users.find((u) => u.email === data.email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(
            data.password,
            user.password,
        );

        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}