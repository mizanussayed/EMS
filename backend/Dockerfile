# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY Directory.Build.props ./
COPY Directory.Packages.props ./
COPY EMS.slnx ./
COPY EMS.Api/EMS.Api.csproj ./EMS.Api/
COPY EMS.Application/EMS.Application.csproj ./EMS.Application/
COPY EMS.Infrastructure/EMS.Infrastructure.csproj ./EMS.Infrastructure/
COPY EMS.Domain/EMS.Domain.csproj ./EMS.Domain/
RUN dotnet restore ./EMS.Api/EMS.Api.csproj

COPY EMS.Api/ ./EMS.Api/
COPY EMS.Application/ ./EMS.Application/
COPY EMS.Infrastructure/ ./EMS.Infrastructure/
COPY EMS.Domain/ ./EMS.Domain/
RUN dotnet publish ./EMS.Api/EMS.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:5000

COPY --from=build /app/publish ./

EXPOSE 5000

ENTRYPOINT ["dotnet", "EMS.Api.dll"]
