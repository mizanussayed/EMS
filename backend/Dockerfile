# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY EMS.slnx ./
COPY EMS.Api/EMS.Api.csproj ./EMS.Api/
RUN dotnet restore ./EMS.Api/EMS.Api.csproj

COPY EMS.Api/ ./EMS.Api/
RUN dotnet publish ./EMS.Api/EMS.Api.csproj -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://0.0.0.0:5000

COPY --from=build /app/publish ./

EXPOSE 5000

ENTRYPOINT ["dotnet", "EMS.Api.dll"]
