import React, { useEffect, useState } from "react";
import LeaseDesktop from "../components/leases/LeaseDesktop";
import LeaseMobile from "../components/leases/LeaseMobile";
import LeaseDesktopSkeleton from "../components/leases/LeaseDesktopSkeleton";
import LeaseMobileSkeleton from "../components/leases/LeaseMobileSkeleton";

import useGetLeases from "../components/hooks/leases/useGetLeases";
import { useAuth } from "../components/context/AuthContext";

export default function Leases() {

  const { userId } = useAuth();
  const { leases, isLeasesLoading } = useGetLeases(userId);

  return (
    <section>
      {isLeasesLoading ? (
        <>
          <LeaseDesktopSkeleton rows={3} />
          <LeaseMobileSkeleton cards={3} />
        </>
      ) : (
        <>
          <LeaseDesktop leases={leases} />
          <LeaseMobile leases={leases} />
        </>
      )}
    </section>
  );
}