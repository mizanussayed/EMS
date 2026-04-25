# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY EMS.slnx ./
COPY backend/EMS.Api/EMS.Api.csproj ./backend/EMS.Api/
RUN dotnet restore ./backend/EMS.Api/EMS.Api.csproj

COPY backend/EMS.Api/ ./backend/EMS.Api/
RUN dotnet publish ./backend/EMS.Api/EMS.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:5000

COPY --from=build /app/publish ./

EXPOSE 5000

ENTRYPOINT ["dotnet", "EMS.Api.dll"]
