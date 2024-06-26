import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from './user.service';
import { LoginResponse, RegisterResponse } from 'src/auth/type';
import { LoginDto, RegisterDto } from 'src/auth/dto';
import { Response, Request } from 'express';
import { BadRequestException, UseFilters } from '@nestjs/common';
import { GraphQLErrorFilter } from 'src/filters/custom-exception.filter';
@UseFilters(GraphQLErrorFilter)
@Resolver()
export class UserResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    const { user } = await this.authService.register(registerDto, context.res);
    return { user };
  }
  @Mutation(() => LoginResponse)
  async login(
    @Args('loginInput') loginDto: LoginDto,
    @Context() context: { res: Response },
  ) {
    return this.authService.login(loginDto, context.res);
  }

  @Mutation(() => String)
  async logout(@Context() context: { res: Response }) {
    this.authService.logout(context.res);
  }

  @Mutation(() => String)
  async refreshToken(@Context() context: { rep: Request; res: Response }) {
    try {
      return this.authService.refreshToken(context.rep, context.res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Query(() => String)
  async hello() {
    return 'hello world';
  }
}
